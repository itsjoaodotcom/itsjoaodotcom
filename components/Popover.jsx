"use client";

import { useState } from "react";
import PopoverItem from "./PopoverItem";

export default function Popover({
  content = "users",     // "users" | "text"
  placeholder = "Search...",
  subheader = null,      // string — small category label instead of search input (sub-level view)
  noHeader = false,      // hide header entirely
  noInternalSearch = false,
  sections = [],
  drag = false,
  checkbox = false,
  selectedLabels = [],
  bottomActions = false,
  scrollLoader = false,
  onSearch,
  onItemClick,
  onItemHover,
}) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

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
      {!noHeader && (subheader ? (
        <div className="popover-subheader">
          <span className="popover-subheader-label">{subheader}</span>
        </div>
      ) : (
        <div className="popover-header">
          <input
            className="popover-input"
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch && onSearch(e.target.value);
            }}
          />
        </div>
      ))}

      <div className="popover-body">
        {sections.map((items, sectionIndex) => {
          const filtered = (q && !noInternalSearch) ? items.filter((item) => item.label.toLowerCase().includes(q)) : items;
          if (filtered.length === 0) return null;
          return (
          <div key={sectionIndex}>
            {sectionIndex > 0 && <div className="popover-divider" />}
            <div className="popover-section">
              {filtered.map((item, itemIndex) => (
                <PopoverItem
                  key={itemIndex}
                  content={content}
                  item={item}
                  drag={drag}
                  checkbox={checkbox}
                  selected={selectedLabels.includes(item.label)}
                  active={!!item.active}
                  badge={item.badge ?? null}
                  chevron={!!item.chevron}
                  radio={!!item.radio}
                  radioSelected={!!item.radioSelected}
                  onClick={() => onItemClick && onItemClick(item, sectionIndex, itemIndex)}
                  onHover={(e) => onItemHover && onItemHover(item, sectionIndex, itemIndex, e)}
                />
              ))}
            </div>
          </div>
          );
        })}

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
