"use client";

export default function PopoverItem({
  content = "users",  // "users" | "text"
  item = {},
  drag = false,
  checkbox = false,
  onClick,
}) {
  return (
    <button
      className={`popover-item${content === "text" ? " popover-item-text" : ""}`}
      onClick={onClick}
    >
      {drag && (
        <img src="/icons/16px/Drag.svg" alt="" className="popover-item-icon popover-drag-handle" />
      )}
      {content === "users" && (
        <img src={item.avatar} alt="" className="popover-item-avatar" />
      )}
      {content === "text" && (
        <img src={item.icon || "/icons/16px/Plus.svg"} alt="" className="popover-item-icon" />
      )}
      <span className="popover-item-label">{item.label}</span>
      {checkbox && <span className="popover-item-checkbox" />}
    </button>
  );
}
