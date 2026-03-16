export default function EmptyStateShowcase() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div className="empty-state">
        <div className="empty-state-content">
          <div className="empty-state-text">
            <p className="empty-state-title">No results found</p>
            <p className="empty-state-description">Try adjusting your search or filter to find what you&apos;re looking for.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
