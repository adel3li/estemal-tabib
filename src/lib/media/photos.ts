"use client";

// Photos on Supabase Storage (decided 5 Nov 2026, instead of R2).
//   submission-photos (private): a seller's photos for a sell request,
//     path {seller id}/{submission id}/{file}; rows in submission_media.
//   device-photos (public): a listing's photos, path {device id}/{file};
//     rows in device_media (sort_order 0 = the cover).
// Every photo is shrunk in the browser first (longest side 1600 px, WebP or
// JPEG ≈ 0.8 quality → usually 150–400 KB).
import type { SupabaseClient } from "@supabase/supabase-js";

export const SUBMISSION_BUCKET = "submission-photos";
export const DEVICE_BUCKET = "device-photos";
const MAX_SIDE = 1600;

export type Shrunk = { blob: Blob; type: string; ext: string; width: number; height: number };

/** Resize + re-encode a photo (keeps small files as they are if already small enough). */
export async function shrinkPhoto(file: File): Promise<Shrunk> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  const encode = (type: string) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.82));
  let blob = await encode("image/webp");
  let type = "image/webp";
  if (!blob || blob.type !== "image/webp") {
    blob = await encode("image/jpeg");
    type = "image/jpeg";
  }
  if (!blob) throw new Error("could not encode the photo");
  return { blob, type, ext: type === "image/webp" ? "webp" : "jpg", width, height };
}

const rand = () => Math.random().toString(36).slice(2, 8);

export const devicePhotoUrl = (sb: SupabaseClient, path: string) => sb.storage.from(DEVICE_BUCKET).getPublicUrl(path).data.publicUrl;

// ── Sell requests ───────────────────────────────────────────────────────
export type SubmissionPhoto = { kind: "photo" | "accessory"; file: File };

/** Upload a new sell request's photos. Returns how many made it. */
export async function uploadSubmissionPhotos(
  sb: SupabaseClient,
  sellerId: string,
  submissionId: string,
  photos: SubmissionPhoto[],
  onProgress?: (done: number, total: number) => void,
): Promise<number> {
  let ok = 0;
  for (let i = 0; i < photos.length; i++) {
    try {
      const s = await shrinkPhoto(photos[i].file);
      const path = `${sellerId}/${submissionId}/${String(i).padStart(2, "0")}-${rand()}.${s.ext}`;
      const up = await sb.storage.from(SUBMISSION_BUCKET).upload(path, s.blob, { contentType: s.type, upsert: false });
      if (up.error) throw up.error;
      const row = await sb.from("submission_media").insert({
        submission_id: submissionId,
        kind: photos[i].kind,
        r2_key: path,
        mime: s.type,
        size_bytes: s.blob.size,
        width: s.width,
        height: s.height,
        sort_order: i,
      });
      if (row.error) throw row.error;
      ok++;
    } catch (e) {
      console.error("photo upload failed", e);
    }
    onProgress?.(i + 1, photos.length);
  }
  return ok;
}

export type MediaItem = { id: string; path: string; kind: string; url: string };

/** A sell request's photos with short-lived links (admins / the seller). */
export async function fetchSubmissionPhotos(sb: SupabaseClient, submissionDbId: string): Promise<MediaItem[]> {
  const { data, error } = await sb.from("submission_media").select("id, kind, r2_key, sort_order").eq("submission_id", submissionDbId).order("sort_order");
  if (error || !data?.length) return [];
  const signed = await sb.storage.from(SUBMISSION_BUCKET).createSignedUrls(data.map((m) => m.r2_key as string), 3600);
  return data.map((m, i) => ({ id: m.id as string, path: m.r2_key as string, kind: m.kind as string, url: signed.data?.[i]?.signedUrl ?? "" })).filter((m) => m.url);
}

// ── Listings ────────────────────────────────────────────────────────────
export async function fetchDevicePhotos(sb: SupabaseClient, deviceDbId: string): Promise<MediaItem[]> {
  const { data } = await sb.from("device_media").select("id, kind, r2_key, sort_order").eq("device_id", deviceDbId).eq("kind", "photo").order("sort_order");
  return (data ?? []).map((m) => ({ id: m.id as string, path: m.r2_key as string, kind: "photo", url: devicePhotoUrl(sb, m.r2_key as string) }));
}

/** Add photos to a listing (admins), after the existing ones. */
export async function uploadDevicePhotos(sb: SupabaseClient, deviceDbId: string, files: File[], startAt: number, onProgress?: (done: number, total: number) => void): Promise<number> {
  let ok = 0;
  for (let i = 0; i < files.length; i++) {
    try {
      const s = await shrinkPhoto(files[i]);
      const path = `${deviceDbId}/${Date.now().toString(36)}-${rand()}.${s.ext}`;
      const up = await sb.storage.from(DEVICE_BUCKET).upload(path, s.blob, { contentType: s.type });
      if (up.error) throw up.error;
      const row = await sb.from("device_media").insert({ device_id: deviceDbId, kind: "photo", r2_key: path, width: s.width, height: s.height, sort_order: startAt + i });
      if (row.error) throw row.error;
      ok++;
    } catch (e) {
      console.error("device photo upload failed", e);
    }
    onProgress?.(i + 1, files.length);
  }
  return ok;
}

export async function deleteDevicePhoto(sb: SupabaseClient, item: MediaItem) {
  await sb.from("device_media").delete().eq("id", item.id);
  await sb.storage.from(DEVICE_BUCKET).remove([item.path]);
}

/** Save a new order (index = sort_order; 0 = the cover). */
export async function reorderDevicePhotos(sb: SupabaseClient, items: MediaItem[]) {
  for (let i = 0; i < items.length; i++) await sb.from("device_media").update({ sort_order: i }).eq("id", items[i].id);
}

/**
 * Inspection photos → the listing. Before publishing (`first`), the team's
 * photos go in front of the seller's, so the cover is an official one.
 */
export async function addInspectionPhotos(sb: SupabaseClient, deviceDbId: string, files: File[], first: boolean, onProgress?: (done: number, total: number) => void): Promise<number> {
  const before = await fetchDevicePhotos(sb, deviceDbId);
  const ok = await uploadDevicePhotos(sb, deviceDbId, files, before.length, onProgress);
  if (first && ok && before.length) {
    const old = new Set(before.map((m) => m.id));
    const all = await fetchDevicePhotos(sb, deviceDbId);
    await reorderDevicePhotos(sb, [...all.filter((m) => !old.has(m.id)), ...all.filter((m) => old.has(m.id))]);
  }
  return ok;
}

/** Accepting a sell request: the seller's photos become the draft listing's first photos. */
export async function copySubmissionPhotosToDevice(sb: SupabaseClient, submissionDbId: string, deviceDbId: string): Promise<number> {
  const { data } = await sb.from("submission_media").select("r2_key, kind, width, height, sort_order").eq("submission_id", submissionDbId).order("sort_order");
  let n = 0;
  for (const m of data ?? []) {
    const from = m.r2_key as string;
    const to = `${deviceDbId}/seller-${String(n).padStart(2, "0")}-${rand()}.${from.split(".").pop()}`;
    const cp = await sb.storage.from(SUBMISSION_BUCKET).copy(from, to, { destinationBucket: DEVICE_BUCKET });
    if (cp.error) {
      console.error("copy failed", cp.error);
      continue;
    }
    await sb.from("device_media").insert({ device_id: deviceDbId, kind: "photo", r2_key: to, width: m.width, height: m.height, sort_order: n });
    n++;
  }
  return n;
}
