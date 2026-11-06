// Download every photo from Supabase Storage to a local folder (backup).
//   npm run backup:photos -- ./backup/photos
// Needs NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_PROJECT_REF) + SUPABASE_SERVICE_ROLE_KEY.
// Files already in the folder are skipped, so running it again only adds new ones.
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const out = process.argv[2] ?? "./backup/photos";
const url = process.env.SUPABASE_PROJECT_REF ? `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co` : process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_PROJECT_REF (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

/** Every file path under `prefix` (folders are walked). */
async function list(bucket, prefix = "") {
  const files = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await sb.storage.from(bucket).list(prefix, { limit: 1000, offset });
    if (error) throw error;
    for (const item of data) {
      const p = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) files.push(...(await list(bucket, p))); // a folder
      else files.push(p);
    }
    if (data.length < 1000) break;
  }
  return files;
}

let saved = 0, skipped = 0;
for (const bucket of ["device-photos", "submission-photos"]) {
  const files = await list(bucket);
  for (const f of files) {
    const dest = path.join(out, bucket, f);
    if (fs.existsSync(dest)) { skipped++; continue; }
    const { data, error } = await sb.storage.from(bucket).download(f);
    if (error) { console.error(`${bucket}/${f}: ${error.message}`); continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(await data.arrayBuffer()));
    saved++;
  }
  console.log(`${bucket}: ${files.length} files`);
}
console.log(`Saved ${saved} new, ${skipped} already there → ${path.resolve(out)}`);
