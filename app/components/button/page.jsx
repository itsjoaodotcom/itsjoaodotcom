export default function ButtonShowcase() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, gap: 8, flexWrap: "wrap" }}>
      <button className="btn btn-accent"><span className="btn-label">Accent</span></button>
      <button className="btn btn-inverse"><span className="btn-label">Inverse</span></button>
      <button className="btn btn-secondary"><span className="btn-label">Secondary</span></button>
      <button className="btn btn-ghost"><span className="btn-label">Ghost</span></button>
      <button className="btn btn-destructive"><span className="btn-label">Destructive</span></button>
      <button className="btn btn-ghost-destructive"><span className="btn-label">Ghost Destructive</span></button>
    </div>
  );
}
