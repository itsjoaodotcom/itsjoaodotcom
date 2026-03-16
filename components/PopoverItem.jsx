"use client";

export default function PopoverItem({
  content = "users",  // "users" | "text"
  item = {},
  drag = false,
  checkbox = false,
  selected = false,
  active = false,
  badge = null,
  chevron = false,
  radio = false,
  radioSelected = false,
  onClick,
  onHover,
}) {
  return (
    <button
      className={`popover-item${content === "text" ? " popover-item-text" : ""}${selected ? " popover-item-selected" : ""}${active ? " popover-item-active" : ""}`}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {drag && (
        <img src="/icons/16px/Drag.svg" alt="" className="popover-item-icon popover-drag-handle" />
      )}
      {content === "users" && (
        <img src={item.avatar} alt="" className="popover-item-avatar" />
      )}
      {content === "text" && item.icon && (
        <img src={item.icon} alt="" className="popover-item-icon" />
      )}
      <span className="popover-item-label">{item.label}</span>
      {badge != null && (
        <span className="popover-item-badge">{badge}</span>
      )}
      {chevron && (
        <img src="/icons/16px/ChevronRight.svg" alt="" className="popover-item-icon" />
      )}
      {radio && (
        <span className={`popover-radio${radioSelected ? " popover-radio--on" : ""}`} />
      )}
      {(checkbox || selected) && (
        <span className={`popover-item-checkbox${selected ? " popover-item-checkbox--checked" : ""}`} />
      )}
    </button>
  );
}
