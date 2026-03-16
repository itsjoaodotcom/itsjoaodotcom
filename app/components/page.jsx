"use client";

import Link from "next/link";
import { registry, legacyLinks } from "../../lib/component-registry";

const allComponents = [
  ...registry.map((c) => ({ name: c.name, category: c.category, href: `/components/${c.slug}` })),
  ...legacyLinks.map((c) => ({ name: c.name, category: c.category, href: c.href })),
];

const categories = [...new Set(allComponents.map((c) => c.category))].sort();

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

function ComponentChip({ name, href }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: 6,
        borderRadius: 6,
        background: "var(--button-secondary)",
        border: "1px solid var(--stroke-primary)",
        boxShadow: "var(--shadow-e1)",
        fontFamily: "var(--font-family)",
        fontSize: 12, fontWeight: 400, lineHeight: "16px",
        color: "var(--content-primary)",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "background 0.1s",
        flexShrink: 0,
      }}
      onMouseOver={(e) => e.currentTarget.style.background = "var(--button-secondaryhover)"}
      onMouseOut={(e) => e.currentTarget.style.background = "var(--button-secondary)"}
    >
      {name}
    </Link>
  );
}

export default function ComponentsPage() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      padding: "80px 40px",
    }}>
      <div style={{
        display: "flex", flexDirection: "column", gap: 40,
        width: "100%", maxWidth: 480,
      }}>
        {categories.map((category) => {
          const items = allComponents.filter((c) => c.category === category);
          return (
            <div key={category} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                width: 120, flexShrink: 0,
                paddingTop: 6, paddingBottom: 6,
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 400, lineHeight: "16px",
                  color: "var(--content-quartenary)",
                  whiteSpace: "nowrap",
                }}>
                  {category}
                </span>
                <Badge count={items.length} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                {items.map((c) => (
                  <ComponentChip key={c.href} name={c.name} href={c.href} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
