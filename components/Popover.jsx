"use client";

import PopoverItem from "./PopoverItem";

export default function Popover({
  content = "users",     // "users" | "text"
  placeholder = "Search...",
  sections = [],
  drag = false,
  checkbox = false,
  bottomActions = false,
  scrollLoader = false,
  onSearch,
  onItemClick,
}) {
  const defaultBottomActions = [
    { icon: "/icons/16px/Retry.svg", label: "Reset filters" },
  ];
  const actionItems = Array.isArray(bottomActions)
    ? bottomActions
    : bottomActions
    ? defaultBottomActions
    : [];

  return (
    <div className="popover">
      <div className="popover-header">
        <input
          className="popover-input"
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      <div className="popover-body">
        {sections.map((items, sectionIndex) => (
          <div key={sectionIndex}>
            {sectionIndex > 0 && <div className="popover-divider" />}
            <div className="popover-section">
              {items.map((item, itemIndex) => (
                <PopoverItem
                  key={itemIndex}
                  content={content}
                  item={item}
                  drag={drag}
                  checkbox={checkbox}
                  onClick={() => onItemClick && onItemClick(item, sectionIndex, itemIndex)}
                />
              ))}
            </div>
          </div>
        ))}

        {actionItems.length > 0 && (
          <>
            <div className="popover-divider" />
            <div className="popover-section">
              {actionItems.map((action, i) => (
                <PopoverItem
                  key={i}
                  content="text"
                  item={{ label: action.label, icon: action.icon }}
                  onClick={() => onItemClick && onItemClick(action, -1, i)}
                />
              ))}
            </div>
          </>
        )}

        {scrollLoader && (
          <div className="popover-scroll-loader">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
    </div>
  );
}
