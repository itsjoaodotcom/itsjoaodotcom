"use client";

import { useState, useRef, useEffect } from "react";
import Popover from "./Popover";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

function computeAlign(el, estimatedWidth = 260) {
  const rect = el.getBoundingClientRect();
  return window.innerWidth - rect.right >= estimatedWidth ? "left" : "right";
}

export function FiltersPopover({ filterSelections, onSelect, onReset, filterCategories, children, hideReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [align, setAlign] = useState("right");
  const [activeCategory, setActiveCategory] = useState(null);
  const [subLevelStyle, setSubLevelStyle] = useState({ top: 0, left: undefined, right: 240 });
  const [filterQuery, setFilterQuery] = useState("");
  const ref = useRef(null);
  const closeTimer = useRef(null);

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveCategory(null), 150);
  }
  function cancelClose() {
    clearTimeout(closeTimer.current);
  }

  useEffect(() => {
    if (!isOpen) return;
    function onMouseDown(e) {
      if (!ref.current?.contains(e.target)) {
        cancelClose();
        setIsOpen(false);
        setActiveCategory(null);
        setFilterQuery("");
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      cancelClose();
    };
  }, [isOpen]);

  const hasFilters = filterCategories.some((cat) => filterSelections[cat.key]?.value?.length > 0);
  const activeCat = filterCategories.find((c) => c.key === activeCategory);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => {
        if (!isOpen && ref.current) setAlign(computeAlign(ref.current));
        setIsOpen((v) => !v);
        setActiveCategory(null);
      }}>
        {children}
      </div>
      {isOpen && (
        <div
          style={{ position: "absolute", top: "calc(100% + 4px)", ...(align === "left" ? { left: -4 } : { right: -4 }), zIndex: 100 }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <Popover
            content="text"
            placeholder="Find filter..."
            noInternalSearch
            sections={filterQuery.trim()
              ? filterCategories.flatMap((cat) =>
                  cat.items
                    .filter((label) => label !== "All" && label.toLowerCase().includes(filterQuery.toLowerCase()))
                    .map((label) => ({ label, _cat: cat.key }))
                ).reduce((acc, item) => { if (!acc[0]) acc[0] = []; acc[0].push(item); return acc; }, [])
              : [filterCategories.map((cat) => ({
                  label: cat.label,
                  icon: cat.icon,
                  chevron: true,
                  active: activeCategory === cat.key,
                  badge: filterSelections[cat.key]?.value?.length > 0 ? filterSelections[cat.key].value.length : null,
                }))]
            }
            bottomActions={hasFilters && !hideReset}
            onSearch={(q) => { setFilterQuery(q); setActiveCategory(null); }}
            onItemHover={(item, _si, _ii, e) => {
              if (filterQuery.trim()) return;
              const cat = filterCategories.find((c) => c.label === item.label);
              if (cat) {
                cancelClose();
                setActiveCategory(cat.key);
                if (e) {
                  const itemRect = e.currentTarget.getBoundingClientRect();
                  const containerRect = ref.current.getBoundingClientRect();
                  const top = itemRect.top - containerRect.top - 4;
                  const MAIN_W = 240, SUB_W = 220, GAP = 4;
                  const mainRight = align === "left"
                    ? containerRect.left - 4 + MAIN_W
                    : containerRect.right + 4;
                  if (window.innerWidth - mainRight - GAP >= SUB_W) {
                    setSubLevelStyle({ top, left: mainRight + GAP - containerRect.left, right: undefined });
                  } else {
                    const mainLeft = mainRight - MAIN_W;
                    setSubLevelStyle({ top, left: undefined, right: containerRect.right - mainLeft + GAP });
                  }
                }
              }
            }}
            onItemClick={(item, sectionIndex) => {
              if (sectionIndex === -1) { onReset(); return; }
              if (item._cat) {
                onSelect(item._cat, item.label);
                setFilterQuery("");
              }
            }}
          />
        </div>
      )}
      {isOpen && activeCat && (
        <div
          style={{ position: "absolute", top: subLevelStyle.top, left: subLevelStyle.left, right: subLevelStyle.right, zIndex: 100 }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <Popover
            content="text"
            noHeader
            checkbox={true}
            selectedLabels={filterSelections[activeCategory]?.value ?? []}
            sections={[activeCat.items.map((label) => ({ label }))]}
            bottomActions={filterSelections[activeCategory]?.value?.length > 0}
            onItemClick={(item, sectionIndex) => {
              if (sectionIndex === -1) { onSelect(activeCategory, null); return; }
              onSelect(activeCategory, item.label);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function FiltersButton({ filterSelections, onSelect, onReset, filterCategories }) {
  const hasFilters = filterCategories.some((cat) => filterSelections[cat.key]?.value?.length > 0);
  return (
    <FiltersPopover filterSelections={filterSelections} onSelect={onSelect} onReset={onReset} filterCategories={filterCategories}>
      <button className="btn btn-secondary">
        <span style={{ position: "relative", display: "inline-flex", width: 16, height: 16, flexShrink: 0 }}>
          <img src="/icons/16px/Filter.svg" width={16} height={16} alt="" style={iconFilter} />
          {hasFilters && (
            <span style={{
              position: "absolute", left: 9, top: 1,
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--content-accent, #4061d8)",
              boxShadow: "0 0 0 1.5px var(--surface-primary, #fff)",
            }} />
          )}
        </span>
        <span className="btn-label">Filters</span>
      </button>
    </FiltersPopover>
  );
}
