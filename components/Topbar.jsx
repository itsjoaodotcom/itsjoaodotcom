"use client";

export default function Topbar() {
  return (
    <header className="voc-topbar">
      <div className="voc-topbar-search">
        <img src="/icons/16px/Search.svg" width={16} height={16} alt="" />
        <input type="text" placeholder="Ask anything about your feedback..." />
        <span className="voc-topbar-kbd">⌘K</span>
      </div>
      <div className="voc-topbar-user">
        <div className="voc-topbar-avatar">G</div>
        <span className="voc-topbar-username">George White</span>
      </div>
    </header>
  );
}
