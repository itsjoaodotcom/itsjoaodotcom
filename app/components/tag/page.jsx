const colors = ["blue", "red", "green", "orange", "purple", "cyan", "brown", "grey"];

export default function TagShowcase() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 480 }}>
        {colors.map((c) => (
          <span className={`tag tag-${c}`} key={c}>
            <span className="tag-dot" />
            <span className="tag-label">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
          </span>
        ))}
        {colors.map((c) => (
          <span className={`tag tag-filled tag-${c}`} key={`filled-${c}`}>
            <span className="tag-dot" />
            <span className="tag-label">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
