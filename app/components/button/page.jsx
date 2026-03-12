export const metadata = { title: "Button — Clarity Components" };

export default function ButtonShowcase() {
  return (
    <div style={{ fontFamily: "var(--font-family)", background: "var(--surface-secondary)", color: "var(--content-primary)", minHeight: "100vh", padding: "48px 40px 80px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 40 }}>Button</h1>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--content-tertiary)", marginBottom: 16 }}>Variants</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn btn-accent"><span className="btn-label">Accent</span></button>
            <button className="btn btn-inverse"><span className="btn-label">Inverse</span></button>
            <button className="btn btn-secondary"><span className="btn-label">Secondary</span></button>
            <button className="btn btn-ghost"><span className="btn-label">Ghost</span></button>
            <button className="btn btn-destructive"><span className="btn-label">Destructive</span></button>
            <button className="btn btn-ghost-destructive"><span className="btn-label">Ghost Destructive</span></button>
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--content-tertiary)", marginBottom: 16 }}>Sizes</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="btn btn-accent"><span className="btn-label">Default (28px)</span></button>
            <button className="btn btn-accent btn-sm"><span className="btn-label">Small (24px)</span></button>
            <button className="btn btn-accent btn-micro"><span className="btn-label">Micro (20px)</span></button>
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--content-tertiary)", marginBottom: 16 }}>Icon only</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="btn btn-accent btn-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <button className="btn btn-secondary btn-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <button className="btn btn-ghost btn-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--content-tertiary)", marginBottom: 16 }}>States</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="btn btn-accent" disabled><span className="btn-label">Disabled</span></button>
            <button className="btn btn-accent is-loading"><span className="btn-label">Loading</span></button>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--content-tertiary)", marginBottom: 16 }}>Split button</h2>
          <div className="btn-split">
            <button className="btn btn-accent"><span className="btn-label">Send</span></button>
            <button className="btn btn-accent btn-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 6.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
