export const metadata = { title: "Tag — Clarity Components" };

const colors = ["blue", "red", "green", "orange", "purple", "cyan", "brown", "grey"];

export default function TagShowcase() {
  return (
    <div style={{ fontFamily: "var(--font-family)", background: "var(--surface-secondary)", color: "var(--content-primary)", minHeight: "100vh", padding: "48px 40px 80px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 40 }}>Tag</h1>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--content-tertiary)", marginBottom: 16 }}>Ghost (default)</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {colors.map((c) => (
              <span className={`tag tag-${c}`} key={c}>
                <span className="tag-dot"></span>
                <span className="tag-label">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              </span>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--content-tertiary)", marginBottom: 16 }}>Filled</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {colors.map((c) => (
              <span className={`tag tag-filled tag-${c}`} key={c}>
                <span className="tag-dot"></span>
                <span className="tag-label">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--content-tertiary)", marginBottom: 16 }}>Small</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {colors.map((c) => (
              <span className={`tag tag-${c} tag-sm`} key={c}>
                <span className="tag-dot"></span>
                <span className="tag-label">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
