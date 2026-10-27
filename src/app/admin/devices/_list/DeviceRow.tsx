"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { fmt, typeLabel } from "@/lib/demo/labels";
import type { Device } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { artFor } from "../art";
import { INSP, SRC, ST, canToggle, toggleOf } from "./meta";

const stop = (e: MouseEvent) => e.stopPropagation();

export function PencilIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h4L19 9l-4-4L4 16z" />
    </svg>
  );
}

export function DeviceRow({
  d,
  selected,
  onOpen,
  onToggle,
  onFeature,
}: {
  d: Device;
  selected: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onFeature: () => void;
}) {
  const st = ST[d.status];
  const sr = SRC[d.source];
  const ins = INSP[d.inspection];
  const t = toggleOf(d);
  const toggleable = canToggle(d);
  return (
    <div
      className="al-tr"
      role="row"
      onClick={onOpen}
      style={{ background: selected ? "#EEF6F3" : "transparent", boxShadow: `inset -3px 0 0 ${selected ? "#0D5C55" : "transparent"}` }}
    >
      <div className="al-td al-c-name" role="cell">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="al-thumb" style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #DCE3DF", flex: "none", position: "relative" }}>
            <svg role="img" aria-label={d.title} viewBox="0 0 120 90" style={{ display: "block", width: "100%", height: "100%" }}>
              <use href={artFor(d.type)} />
            </svg>
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4, minWidth: 0, flex: "1 1 auto" }}>
            <button
              type="button"
              className="al-name"
              onClick={(e) => {
                stop(e);
                onOpen();
              }}
              aria-label={`افتح تفاصيل ${d.title}`}
            >
              {d.title || "جهاز من غير اسم"}
            </button>
            <span className="al-meta" style={{ fontSize: 12, color: "#4A5A56", display: "flex", gap: 6, alignItems: "center" }}>
              {d.id} · {d.governorate}
              {d.featured ? (
                <span className="al-pill" style={{ background: "#FBEEDC", color: "#8A4209", padding: "0 8px" }}>
                  ★ مميز
                </span>
              ) : null}
            </span>
          </span>
        </div>
      </div>
      <div className="al-td al-c-type" role="cell" style={{ whiteSpace: "nowrap" }}>
        {typeLabel(d.type)}
      </div>
      <div className="al-td al-c-src" role="cell">
        <span className="al-pill" style={{ background: sr.bg, color: sr.fg }}>
          {sr.l}
        </span>
      </div>
      <div className="al-td al-c-insp" role="cell">
        <span className="al-pill" style={{ background: ins.bg, color: ins.fg }}>
          {ins.l}
        </span>
      </div>
      <div className="al-td al-c-price" role="cell" style={{ whiteSpace: "nowrap", fontWeight: 700 }}>
        {d.price ? fmt(d.price) : "—"} <span style={{ fontSize: 12, fontWeight: 400, color: "#4A5A56" }}>ج.م</span>
      </div>
      <div className="al-td al-c-st" role="cell">
        <span className="al-pill" style={{ background: st.bg, color: st.fg }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: st.fg }} />
          {st.l}
        </span>
      </div>
      <div className="al-td al-c-views" role="cell" style={{ whiteSpace: "nowrap", fontSize: 13, lineHeight: 1.5 }}>
        <span style={{ fontWeight: 600 }}>{d.views ? `${fmt(d.views)} مشاهدة` : "لسه متنشرش"}</span>
        <br />
        <span style={{ color: "#4A5A56" }}>{d.createdAt}</span>
      </div>
      <div className="al-td al-c-act" role="cell">
        <div className="al-acts">
          <Link href={routes.admin.editDevice(d.id)} className="al-act" onClick={stop} aria-label={`عدّل ${d.title}`}>
            <PencilIcon />
            تعديل
          </Link>
          {toggleable ? (
            <button
              type="button"
              className="al-act"
              onClick={(e) => {
                stop(e);
                onToggle();
              }}
              aria-label={`${t.label} ${d.title}`}
              style={{ color: t.fg }}
            >
              {t.label}
            </button>
          ) : (
            <span
              className="al-act"
              title={d.status === "reserved" ? "مينفعش يتخفى وهو محجوز بعربون" : "الجهاز اتباع، تابعه من الطلبات والشحن"}
              style={{ cursor: "default", color: "#8A9A95", background: "#F5F7F4", borderStyle: "dashed" }}
            >
              {d.status === "reserved" ? "محجوز" : "اتباع"}
            </span>
          )}
          <button
            type="button"
            className="al-act"
            onClick={(e) => {
              stop(e);
              onFeature();
            }}
            aria-pressed={d.featured}
            aria-label={(d.featured ? "شيل التمييز من " : "ميّز ") + d.title}
            style={{
              background: d.featured ? "#FBEEDC" : "#FFFFFF",
              color: d.featured ? "#8A4209" : "#12221F",
              borderColor: d.featured ? "#F0C88A" : "#C9D4CF",
            }}
          >
            {d.featured ? "★ مميز" : "☆ تمييز"}
          </button>
        </div>
      </div>
    </div>
  );
}
