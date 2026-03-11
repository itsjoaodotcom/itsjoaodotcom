export const metadata = { title: "Empty State — Clarity Components" };

export default function EmptyStateShowcase() {
  return (
    <div style={{ fontFamily: "var(--font-family)", background: "var(--surface-primary)", minHeight: "100vh", padding: "48px 32px 80px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--content-primary)", marginBottom: 48 }}>Empty States</h1>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px", borderRadius: 12, background: "var(--surface-secondary)", border: "1px solid var(--stroke-primary)" }}>
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-text">
                <p className="empty-state-title">No results found</p>
                <p className="empty-state-description">Try adjusting your search or filter to find what you&apos;re looking for.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
