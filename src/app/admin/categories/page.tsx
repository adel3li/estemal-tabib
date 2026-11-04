"use client";

// «الأنواع» — device categories and their own detail fields (client,
// WhatsApp 4 Nov 2026: "add categories like loupe, micro motor, rotary that
// show in the filter, and add details inside the product, e.g. a camera's
// memory 128 / 256 GB, flash…"). Super Admin only. Not in the design files.
import { useMemo, useState } from "react";
import { loadCategories } from "@/lib/categories";
import { BUILTIN_TYPES, allCategories, type Category, type CategoryField, type FieldKind } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import type { BuiltinType } from "@/lib/demo/types";
import { useCategoriesVersion } from "@/lib/categories";
import { supabaseBrowser } from "@/lib/supabase/client";
import "../home.css";

const KIND: Record<FieldKind, string> = { text: "نص", number: "رقم", select: "اختيار من قايمة" };
const newKey = () => `f_${Math.random().toString(36).slice(2, 8)}`;
const newId = () => `c_${Date.now().toString(36)}`;

type Draft = { label: string; art: BuiltinType; fields: (CategoryField & { optionsText: string })[] };
const draftOf = (c: Category): Draft => ({ label: c.label, art: c.art, fields: c.fields.map((f) => ({ ...f, optionsText: (f.options ?? []).join("، ") })) });
const splitOptions = (t: string) => t.split(/[،,\n]/).map((x) => x.trim()).filter(Boolean);

function Editor({ c, count, onSaved }: { c: Category; count: number; onSaved: (msg: string) => void }) {
  const [d, setD] = useState<Draft>(() => draftOf(c));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const setField = (i: number, patch: Partial<Draft["fields"][number]>) => setD((x) => ({ ...x, fields: x.fields.map((f, j) => (j === i ? { ...f, ...patch } : f)) }));
  const move = (i: number, dir: -1 | 1) =>
    setD((x) => {
      const f = [...x.fields];
      const j = i + dir;
      if (j < 0 || j >= f.length) return x;
      [f[i], f[j]] = [f[j], f[i]];
      return { ...x, fields: f };
    });

  const save = async () => {
    if (d.label.trim().length < 2) return setErr("اكتب اسم النوع.");
    const bad = d.fields.find((f) => f.label.trim().length < 1 || (f.kind === "select" && splitOptions(f.optionsText).length < 2));
    if (bad) return setErr(bad.label.trim() ? `«${bad.label}»: اكتب اختيارين على الأقل، بينهم فاصلة.` : "كل خانة محتاجة اسم.");
    setBusy(true);
    const fields: CategoryField[] = d.fields.map(({ optionsText, ...f }) => ({
      key: f.key,
      label: f.label.trim(),
      kind: f.kind,
      ...(f.kind === "select" ? { options: splitOptions(optionsText) } : {}),
      ...(f.unit?.trim() ? { unit: f.unit.trim() } : {}),
    }));
    const { error } = await supabaseBrowser().from("device_categories").update({ label: d.label.trim(), art: d.art, fields }).eq("id", c.id);
    setBusy(false);
    if (error) return setErr("ما قدرناش نحفظ. جرّب تاني.");
    setErr("");
    onSaved(`«${d.label.trim()}» اتحفظ.`);
  };

  return (
    <div style={{ padding: 16, borderRadius: 16, background: "#F5F7F4", display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="ad-grid">
        <label className="ad-field">
          اسم النوع
          <input type="text" className="ad-in" value={d.label} onChange={(e) => setD((x) => ({ ...x, label: e.target.value }))} maxLength={60} />
        </label>
        <label className="ad-field">
          الرسمة اللي تظهر له
          <select className="ad-in" value={d.art} onChange={(e) => setD((x) => ({ ...x, art: e.target.value as BuiltinType }))}>
            {BUILTIN_TYPES.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </label>
      </div>
      <div className="ad-hint">فيه {count} جهاز من النوع ده.</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <b>تفاصيل خاصة بالنوع ده</b>
        <span className="ad-hint">بتظهر في «إضافة جهاز» للنوع ده، وفي صفحة الجهاز. مثال للكاميرا: الذاكرة (اختيار: 128 GB، 256 GB)، الفلاش (اختيار: فيه، مفيش).</span>
        {d.fields.map((f, i) => (
          <div key={f.key} style={{ padding: 12, borderRadius: 12, background: "#FFFFFF", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="ad-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
              <label className="ad-field">
                اسم الخانة
                <input type="text" className="ad-in" value={f.label} onChange={(e) => setField(i, { label: e.target.value })} placeholder="مثال: الذاكرة" maxLength={40} />
              </label>
              <label className="ad-field">
                النوع
                <select className="ad-in" value={f.kind} onChange={(e) => setField(i, { kind: e.target.value as FieldKind })}>
                  {(Object.keys(KIND) as FieldKind[]).map((k) => <option key={k} value={k}>{KIND[k]}</option>)}
                </select>
              </label>
              {f.kind === "select" ? (
                <label className="ad-field">
                  الاختيارات (بينهم فاصلة)
                  <input type="text" className="ad-in" value={f.optionsText} onChange={(e) => setField(i, { optionsText: e.target.value })} placeholder="128 GB، 256 GB" />
                </label>
              ) : (
                <label className="ad-field">
                  الوحدة (اختياري)
                  <input type="text" className="ad-in" value={f.unit ?? ""} onChange={(e) => setField(i, { unit: e.target.value })} placeholder="مثال: لتر، وات" maxLength={12} />
                </label>
              )}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button type="button" className="ad-btn ad-sec" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`طلّع ${f.label || "الخانة"} لفوق`}>↑</button>
              <button type="button" className="ad-btn ad-sec" onClick={() => move(i, 1)} disabled={i === d.fields.length - 1} aria-label={`نزّل ${f.label || "الخانة"} لتحت`}>↓</button>
              <button type="button" className="ad-btn ad-sec" style={{ color: "#B3261E" }} onClick={() => setD((x) => ({ ...x, fields: x.fields.filter((_, j) => j !== i) }))}>شيل الخانة</button>
            </div>
          </div>
        ))}
        <div>
          <button type="button" className="ad-btn ad-sec" onClick={() => setD((x) => ({ ...x, fields: [...x.fields, { key: newKey(), label: "", kind: "select", optionsText: "" }] }))}>
            + خانة تفاصيل
          </button>
        </div>
      </div>
      {err ? <div role="alert" style={{ color: "#B3261E", fontWeight: 600 }}>{err}</div> : null}
      <div><button type="button" className="ad-btn ad-pri" disabled={busy} onClick={() => void save()}>احفظ النوع</button></div>
    </div>
  );
}

export default function CategoriesPage() {
  useCategoriesVersion();
  const { ready, state } = useDemo();
  const list = allCategories();
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    state.devices.forEach((d) => m.set(d.type, (m.get(d.type) ?? 0) + 1));
    return m;
  }, [state.devices]);
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [label, setLabel] = useState("");
  const [art, setArt] = useState<BuiltinType>("other");
  const [busy, setBusy] = useState(false);

  const reload = async (m: string) => {
    await loadCategories(supabaseBrowser());
    setMsg(m);
  };

  const add = async () => {
    if (label.trim().length < 2) return setMsg("اكتب اسم النوع الجديد.");
    if (list.some((c) => c.label === label.trim())) return setMsg("فيه نوع بنفس الاسم.");
    setBusy(true);
    const before = list.filter((c) => c.id !== "other").reduce((a, c) => Math.max(a, c.sort), 0);
    const id = newId();
    const { error } = await supabaseBrowser().from("device_categories").insert({ id, label: label.trim(), art, sort: before + 10 });
    setBusy(false);
    if (error) return setMsg("ما قدرناش نضيف النوع. جرّب تاني.");
    setLabel("");
    setOpen(id);
    await reload(`«${label.trim()}» اتضاف — بيظهر دلوقتي في الفلاتر وفورم البيع والطلب. ضيف له تفاصيل لو محتاج.`);
  };

  const patch = async (c: Category, p: Partial<Pick<Category, "active" | "sort">>, m: string) => {
    const { error } = await supabaseBrowser().from("device_categories").update(p).eq("id", c.id);
    if (error) return setMsg("ما قدرناش نحفظ. جرّب تاني.");
    await reload(m);
  };
  const swap = async (i: number, dir: -1 | 1) => {
    const a = list[i], b = list[i + dir];
    if (!a || !b || a.id === "other" || b.id === "other") return;
    const sb = supabaseBrowser();
    await sb.from("device_categories").update({ sort: b.sort }).eq("id", a.id);
    await sb.from("device_categories").update({ sort: a.sort === b.sort ? a.sort + dir : a.sort }).eq("id", b.id);
    await reload("الترتيب اتحفظ.");
  };

  return (
    <>
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الأنواع</div>
        <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>أنواع الأجهزة</h1>
        <div style={{ color: "#4A5A56" }}>الأنواع اللي بتظهر في فلاتر الموقع وفورم «اعرض جهازك» و«اطلب جهاز»، والتفاصيل الخاصة بكل نوع.</div>
      </div>

      {msg ? <div role="status" style={{ padding: "12px 16px", borderRadius: 14, background: "#EAF5DD", color: "#2F5E16", fontWeight: 600 }}>{msg}</div> : null}

      <section className="ad-card" aria-labelledby="ct-add" style={{ gap: 12 }}>
        <h2 className="ad-h" id="ct-add" style={{ fontWeight: 700 }}>ضيف نوع جديد</h2>
        <div className="ad-grid">
          <label className="ad-field">
            اسم النوع
            <input type="text" className="ad-in" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="مثال: سكيلر" maxLength={60} />
          </label>
          <label className="ad-field">
            الرسمة اللي تظهر له
            <select className="ad-in" value={art} onChange={(e) => setArt(e.target.value as BuiltinType)}>
              {BUILTIN_TYPES.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </label>
        </div>
        <div><button type="button" className="ad-btn ad-pri" disabled={busy} onClick={() => void add()}>ضيف النوع</button></div>
      </section>

      <section className="ad-card" aria-label="الأنواع" style={{ gap: 10 }}>
        {!ready ? (
          <div role="status" className="hm-empty">بنحمّل…</div>
        ) : (
          <div className="hm-items">
            {list.map((c, i) => (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="hm-item" style={{ cursor: "default", flexWrap: "wrap", opacity: c.active ? 1 : 0.65 }}>
                  <span style={{ minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                    <b>{c.label}{c.active ? "" : " (مخفي)"}</b>
                    <span className="hm-sub">{counts.get(c.id) ?? 0} جهاز · {c.fields.length ? `${c.fields.length} تفاصيل: ${c.fields.map((f) => f.label).join("، ")}` : "من غير تفاصيل خاصة"}</span>
                  </span>
                  <span style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {c.id !== "other" ? (
                      <>
                        <button type="button" className="ad-btn ad-sec" disabled={i === 0} onClick={() => void swap(i, -1)} aria-label={`طلّع ${c.label} لفوق`}>↑</button>
                        <button type="button" className="ad-btn ad-sec" disabled={list[i + 1]?.id === "other" || i === list.length - 1} onClick={() => void swap(i, 1)} aria-label={`نزّل ${c.label} لتحت`}>↓</button>
                      </>
                    ) : null}
                    <button type="button" className="ad-btn ad-sec" aria-expanded={open === c.id} onClick={() => setOpen(open === c.id ? null : c.id)}>{open === c.id ? "اقفل" : "عدّل"}</button>
                    {c.id !== "other" ? (
                      <button type="button" className="ad-btn ad-sec" style={c.active ? { color: "#B3261E" } : undefined} onClick={() => void patch(c, { active: !c.active }, c.active ? `«${c.label}» اتخفى من الفلاتر والفورمات (الأجهزة اللي منه فضلت زي ما هي).` : `«${c.label}» رجع يظهر.`)}>
                        {c.active ? "اخفيه" : "أظهره"}
                      </button>
                    ) : null}
                  </span>
                </div>
                {open === c.id ? <Editor key={`${c.id}-${c.label}-${c.fields.length}`} c={c} count={counts.get(c.id) ?? 0} onSaved={(m) => void reload(m)} /> : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
