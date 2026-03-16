"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getComponent, getComponentName, totalCount } from "../../lib/component-registry";

function Badge({ count }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 16, height: 16, minWidth: 16,
      background: "var(--surface-tint)",
      border: "1px solid var(--stroke-primary)",
      borderRadius: 4,
      fontFamily: "var(--font-family)",
      fontSize: 10, fontWeight: 600, lineHeight: "12px",
      color: "var(--content-tertiary)",
      flexShrink: 0,
    }}>
      {count}
    </div>
  );
}

export default function ComponentsLayout({ children }) {
  const pathname = usePathname();
  const isIndex = pathname === "/components";
  const slug = isIndex ? null : pathname.replace("/components/", "");
  const isRegistrySlug = !isIndex && slug && getComponent(slug) !== null;

  // Registry slug pages manage their own white card + sidebar
  if (isRegistrySlug) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "var(--surface-secondary)",
        display: "flex",
        fontFamily: "var(--font-family)",
        WebkitFontSmoothing: "antialiased",
      }}>
        {children}
      </div>
    );
  }

  const componentName = slug ? getComponentName(slug) : null;

  // Index + legacy pages: standard white card layout
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--surface-secondary)",
      padding: 6,
      fontFamily: "var(--font-family)",
      WebkitFontSmoothing: "antialiased",
    }}>
      <div style={{
        background: "var(--surface-primary)",
        border: "1px solid var(--stroke-secondarystrong)",
        borderRadius: 8,
        minHeight: "calc(100vh - 12px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* Breadcrumb */}
        <div style={{
          display: "flex", alignItems: "center", gap: isIndex ? 6 : 2,
          padding: "12px 20px",
          flexShrink: 0,
        }}>
          {isIndex ? (
            <>
              <span style={{
                fontSize: 14, fontWeight: 400, lineHeight: "20px",
                color: "var(--content-primary)",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-family)",
              }}>
                Components
              </span>
              <Badge count={totalCount} />
            </>
          ) : (
            <>
              <Link href="/components" style={{
                fontSize: 14, fontWeight: 400, lineHeight: "20px",
                color: "var(--content-primary)",
                letterSpacing: "-0.02em",
                textDecoration: "none",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-family)",
              }}>
                Components
              </Link>
              <img
                src="/icons/16px/Slash.svg"
                width={16} height={16} alt=""
                style={{ filter: "var(--icon-filter)", flexShrink: 0 }}
              />
              <span style={{
                fontSize: 14, fontWeight: 400, lineHeight: "20px",
                color: "var(--content-tertiary)",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-family)",
              }}>
                {componentName}
              </span>
            </>
          )}
        </div>

        {/* Page content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {isIndex ? children : (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: 40,
            }}>
              <div style={{ borderRadius: 8, border: "1px dashed #B3C7FF", padding: 40 }}>
                {children}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
