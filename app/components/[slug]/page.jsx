"use client";

import Link from "next/link";
import { useState, use } from "react";
import { getComponent } from "../../../lib/component-registry";

function buildInitialValues(entry) {
  if (!entry?.controls) return {};
  const vals = {};
  for (const ctrl of entry.controls) {
    if (ctrl.key.startsWith("_")) {
      vals[ctrl.key] = ctrl.default ?? false;
    } else {
      const fromProps = entry.defaultProps?.[ctrl.key];
      vals[ctrl.key] = fromProps !== undefined
        ? fromProps
        : ctrl.type === "toggle" ? false : ctrl.options?.[0] ?? "";
    }
  }
  return vals;
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 24, height: 16, borderRadius: 999, border: "none",
        cursor: "pointer", flexShrink: 0, position: "relative",
        background: value ? "var(--content-accent)" : "var(--stroke-secondarystrong)",
        transition: "background 0.15s",
        padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 2,
        left: value ? 10 : 2,
        width: 12, height: 12, borderRadius: "50%",
        background: "white",
        transition: "left 0.15s",
        display: "block",
      }} />
    </button>
  );
}

export default function ComponentViewer({ params }) {
  const { slug } = use(params);
  const entry = getComponent(slug);
  const [controlValues, setControlValues] = useState(() => buildInitialValues(entry));

  function setControl(key, value) {
    setControlValues((prev) => ({ ...prev, [key]: value }));
  }

  if (!entry) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--content-tertiary)", fontSize: 13, fontFamily: "var(--font-family)",
      }}>
        Component not found
      </div>
    );
  }

  const Component = entry.component;
  const activeProps = entry.computeProps
    ? entry.computeProps(entry.defaultProps, controlValues)
    : { ...entry.defaultProps, ...controlValues };

  const controls = entry.controls ?? [];

  return (
    <div style={{ flex: 1, display: "flex", minHeight: "100vh" }}>

      {/* Left: white card with breadcrumb + canvas */}
      <div style={{
        flex: 1, padding: "6px 0 6px 6px",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          flex: 1,
          background: "var(--surface-primary)",
          border: "1px solid var(--stroke-secondarystrong)",
          borderRadius: 8,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Breadcrumb */}
          <div style={{
            display: "flex", alignItems: "center", gap: 2,
            padding: "12px 20px", flexShrink: 0,
          }}>
            <Link href="/components" style={{
              fontSize: 14, fontWeight: 400, lineHeight: "20px",
              color: "var(--content-primary)", letterSpacing: "-0.02em",
              textDecoration: "none", whiteSpace: "nowrap",
              fontFamily: "var(--font-family)",
            }}>
              Components
            </Link>
            <img src="/icons/16px/Slash.svg" width={16} height={16} alt=""
              style={{ filter: "var(--icon-filter)", flexShrink: 0 }} />
            <span style={{
              fontSize: 14, fontWeight: 400, lineHeight: "20px",
              color: "var(--content-tertiary)", letterSpacing: "-0.02em",
              whiteSpace: "nowrap", fontFamily: "var(--font-family)",
            }}>
              {entry.name}
            </span>
          </div>

          {/* Canvas */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", overflow: "auto",
            paddingLeft: 40, paddingRight: 40,
          }}>
            <div style={{ flex: 1, flexShrink: 0, minHeight: 40 }} />
            <div style={{
              borderRadius: 8,
              border: "1px dashed #B3C7FF",
              padding: 40,
            }}>
              <Component {...activeProps} />
            </div>
            <div style={{ flex: 1, minHeight: 40 }} />
          </div>
        </div>
      </div>

      {/* Right: sidebar */}
      {controls.length > 0 && (
        <div style={{
          width: 252, flexShrink: 0,
          background: "var(--surface-secondary)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Sidebar header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 12px 8px",
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 14, fontWeight: 500, lineHeight: "20px",
              color: "var(--content-primary)", letterSpacing: "-0.02em",
              fontFamily: "var(--font-family)",
            }}>
              {entry.name}
            </span>
            <button style={{
              background: "var(--button-ghost)", border: "none",
              borderRadius: 6, padding: 6, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src="/icons/16px/SidebarRight.svg" width={16} height={16} alt=""
                style={{ filter: "var(--icon-filter)" }} />
            </button>
          </div>

          {/* Controls list */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 4,
            padding: "4px 8px 8px", overflowY: "auto",
          }}>
            {controls.map((ctrl) => {
              const val = controlValues[ctrl.key];

              return (
                <div key={ctrl.key} style={{
                  border: "1px solid var(--stroke-primary)",
                  borderRadius: 8,
                  display: "flex", alignItems: "center",
                  background: "var(--surface-primary)",
                }}>
                  <div style={{
                    flex: 1, padding: "8px 12px",
                    fontSize: 14, fontWeight: 400, lineHeight: "20px",
                    color: "var(--content-secondary)", letterSpacing: "-0.02em",
                    fontFamily: "var(--font-family)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {ctrl.label}
                  </div>

                  <div style={{ padding: 10, flexShrink: 0 }}>
                    {ctrl.type === "toggle" && (
                      <Toggle value={val} onChange={(v) => setControl(ctrl.key, v)} />
                    )}
                    {ctrl.type === "select" && (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 2,
                        cursor: "pointer",
                      }}>
                        <span style={{
                          fontSize: 14, fontWeight: 400, lineHeight: "20px",
                          color: "var(--content-secondary)", letterSpacing: "-0.02em",
                          fontFamily: "var(--font-family)",
                        }}>
                          {String(val).charAt(0).toUpperCase() + String(val).slice(1)}
                        </span>
                        <select
                          value={val}
                          onChange={(e) => setControl(ctrl.key, e.target.value)}
                          style={{
                            position: "absolute", opacity: 0,
                            width: 80, cursor: "pointer",
                          }}
                        >
                          {ctrl.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                          ))}
                        </select>
                        <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt=""
                          style={{ filter: "var(--icon-filter)", flexShrink: 0 }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
