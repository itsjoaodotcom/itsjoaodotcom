"use client";

import { useState, useRef, useEffect } from "react";
import Popover from "./Popover";
import Calendar from "./Calendar";

function computeAlign(el, estimatedWidth = 220) {
  const rect = el.getBoundingClientRect();
  return window.innerWidth - rect.right >= estimatedWidth ? "left" : "right";
}

const DATE_PRESETS = ["Last 7 days", "Last 30 days", "Last 90 days", "Custom"];
const iconFilter = { filter: "brightness(0) invert(0.53)" };

function formatRange(from, to) {
  if (!from || !to) return "Custom";
  const opts = { month: "short", day: "numeric" };
  return `${from.toLocaleDateString("en-US", opts)} – ${to.toLocaleDateString("en-US", opts)}`;
}

function getPresetRange(period) {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date(to);
  if (period === "Last 7 days") from.setDate(from.getDate() - 7);
  else if (period === "Last 30 days") from.setDate(from.getDate() - 30);
  else if (period === "Last 90 days") from.setDate(from.getDate() - 90);
  from.setHours(0, 0, 0, 0);
  return { from, to };
}

export default function DateRangeButton({ onChange }) {
  const [mode, setMode] = useState(null);
  const [activePeriod, setActivePeriod] = useState("Last 30 days");
  const [activeRange, setActiveRange] = useState(null);
  const [align, setAlign] = useState("right");
  const ref = useRef(null);

  useEffect(() => {
    if (!mode) return;
    function onMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setMode(null);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [mode]);

  function selectPreset(period) {
    setActivePeriod(period);
    setActiveRange(null);
    setMode(null);
    if (onChange) {
      const { from, to } = getPresetRange(period);
      onChange({ period, from, to });
    }
  }

  function applyCustomRange({ from, to }) {
    setActivePeriod("Custom");
    setActiveRange({ from, to });
    setMode(null);
    if (onChange) onChange({ period: "Custom", from, to });
  }

  const label = activePeriod === "Custom" && activeRange
    ? formatRange(activeRange.from, activeRange.to)
    : activePeriod;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="btn btn-secondary"
        onClick={() => {
          if (mode) { setMode(null); return; }
          if (ref.current) setAlign(computeAlign(ref.current));
          setMode("dropdown");
        }}
      >
        <img src="/icons/16px/Calendar.svg" width={16} height={16} alt="" style={iconFilter} />
        <span className="btn-label">{label}</span>
      </button>

      {mode === "dropdown" && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", ...(align === "left" ? { left: -4 } : { right: -4 }), zIndex: 100 }}>
          <Popover
            content="text"
            noHeader
            sections={[DATE_PRESETS.map((p) => p === "Custom"
              ? { label: p, chevron: true, tick: activePeriod === "Custom" && !!activeRange, selected: activePeriod === "Custom" && !!activeRange }
              : { label: p, tick: true, selected: activePeriod === p }
            )]}
            onItemClick={(item) => {
              if (item.label === "Custom") {
                setMode("calendar");
              } else {
                selectPreset(item.label);
              }
            }}
          />
        </div>
      )}

      {mode === "calendar" && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", ...(align === "left" ? { left: -4 } : { right: -4 }), zIndex: 100 }}>
          <Calendar
            onCancel={() => setMode(null)}
            onApply={applyCustomRange}
          />
        </div>
      )}
    </div>
  );
}
