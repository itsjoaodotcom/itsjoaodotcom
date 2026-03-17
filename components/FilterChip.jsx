"use client";

import { useState, useRef, useEffect } from "react";
import Popover from "./Popover";

function computeAlign(el, estimatedWidth = 200) {
  const rect = el.getBoundingClientRect();
  return window.innerWidth - rect.right >= estimatedWidth ? "left" : "right";
}

export default function FilterChip({ label, values = [], op = "is", onRemove, onOpChange, categoryItems = [], onValueToggle }) {
  const displayValue = values.length > 1 ? `${values.length} ${label}` : values[0] ?? "";
  const [opOpen, setOpOpen] = useState(false);
  const [opAlign, setOpAlign] = useState("left");
  const [valOpen, setValOpen] = useState(false);
  const [valAlign, setValAlign] = useState("left");
  const opRef = useRef(null);
  const valRef = useRef(null);

  useEffect(() => {
    if (!opOpen && !valOpen) return;
    function onMouseDown(e) {
      if (opOpen && opRef.current && !opRef.current.contains(e.target)) setOpOpen(false);
      if (valOpen && valRef.current && !valRef.current.contains(e.target)) setValOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [opOpen, valOpen]);

  return (
    <div className="filter-chip">
      <span className="filter-chip-label">{label}</span>

      <div ref={opRef} style={{ position: "relative" }}>
        <button
          className="filter-chip-operator filter-chip-btn"
          onClick={() => {
            if (!opOpen && opRef.current) setOpAlign(computeAlign(opRef.current, 140));
            setOpOpen((v) => !v);
            setValOpen(false);
          }}
        >
          {op}
        </button>
        {opOpen && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", ...(opAlign === "left" ? { left: -4 } : { right: -4 }), zIndex: 200 }}>
            <Popover
              content="text"
              noHeader
              sections={[[
                { label: "is",     radio: true, radioSelected: op === "is" },
                { label: "is not", radio: true, radioSelected: op === "is not" },
              ]]}
              onItemClick={(item) => { onOpChange?.(item.label); setOpOpen(false); }}
            />
          </div>
        )}
      </div>

      <div ref={valRef} style={{ position: "relative" }}>
        <button
          className="filter-chip-value filter-chip-btn"
          onClick={() => {
            if (!valOpen && valRef.current) setValAlign(computeAlign(valRef.current, 220));
            setValOpen((v) => !v);
            setOpOpen(false);
          }}
        >
          {displayValue}
        </button>
        {valOpen && categoryItems.length > 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", ...(valAlign === "left" ? { left: -4 } : { right: -4 }), zIndex: 200 }}>
            <Popover
              content="text"
              noHeader
              checkbox={true}
              selectedLabels={values}
              sections={[categoryItems.map((item) => ({ label: item }))]}
              onItemClick={(item) => { onValueToggle?.(item.label); }}
            />
          </div>
        )}
      </div>

      <button className="filter-chip-remove" onClick={onRemove} aria-label="Remove filter">
        <img src="/icons/16px/Cross.svg" width={12} height={12} alt="" style={{ filter: "brightness(0) invert(0.53)" }} />
      </button>
    </div>
  );
}
