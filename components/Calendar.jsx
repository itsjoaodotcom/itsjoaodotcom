"use client";

import { useState } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const iconFilter = { filter: "brightness(0) invert(0.53)" };

function getCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const cells = [];
  for (let i = offset - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, date: new Date(prevYear, prevMonth, daysInPrev - i), outside: true });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, date: new Date(year, month, d), outside: false });
  const rem = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= rem; d++)
    cells.push({ day: d, date: new Date(nextYear, nextMonth, d), outside: true });
  return cells;
}

function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Calendar({ onCancel, onApply }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [yearOpen, setYearOpen] = useState(false);
  const [yearRangeStart, setYearRangeStart] = useState(() => today.getFullYear() - 11);

  const effTo = to || (from && !to && hovered && hovered >= from ? hovered : null);

  function handleClick(cell) {
    if (cell.outside) return;
    const d = cell.date;
    if (!from || to) { setFrom(d); setTo(null); }
    else if (d >= from) setTo(d);
    else { setFrom(d); setTo(null); }
  }

  function getCellState(cell) {
    if (cell.outside) return "outside";
    const d = cell.date;
    const isFrom = sameDay(d, from);
    const isEffTo = sameDay(d, effTo);
    if (isFrom && (!effTo || isEffTo)) return "single";
    if (isFrom) return "from";
    if (isEffTo) return hovered ? "hover-to" : "to";
    if (from && effTo && d > from && d < effTo) return "range";
    return "default";
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  }

  function toggleYearPicker() {
    if (!yearOpen) setYearRangeStart(year - 11);
    setYearOpen(v => !v);
  }

  const cells = getCalendarGrid(year, month);
  const canApply = !!(from && to);
  const yearPages = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

  return (
    <div className="cal">
      <div className="cal-header">
        <div className="cal-nav">
          {!yearOpen && (
            <>
              <button className="cal-nav-btn" onClick={prevMonth}>
                <img src="/icons/16px/ChevronLeft.svg" width={12} height={12} alt="" style={iconFilter} />
              </button>
              <button className="cal-nav-btn" onClick={nextMonth}>
                <img src="/icons/16px/ChevronRight.svg" width={12} height={12} alt="" style={iconFilter} />
              </button>
              <span className="cal-month">{MONTHS[month]}</span>
            </>
          )}
        </div>
        <button className="cal-year-btn" onClick={toggleYearPicker}>
          <span>{year}</span>
          <img
            src="/icons/16px/ChevronBottom.svg"
            width={16} height={16} alt=""
            style={{ ...iconFilter, transform: yearOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
          />
        </button>
      </div>

      {yearOpen ? (
        <>
          <div className="cal-year-nav">
            <button className="cal-nav-btn" onClick={() => setYearRangeStart(s => s - 12)}>
              <img src="/icons/16px/ChevronLeft.svg" width={12} height={12} alt="" style={iconFilter} />
            </button>
            <span className="cal-year-nav-label">{yearRangeStart} – {yearRangeStart + 11}</span>
            <button className="cal-nav-btn" onClick={() => setYearRangeStart(s => s + 12)}>
              <img src="/icons/16px/ChevronRight.svg" width={12} height={12} alt="" style={iconFilter} />
            </button>
          </div>
          <div className="cal-year-grid">
            {yearPages.map(y => (
              <button
                key={y}
                className={`cal-year-item${y === year ? " cal-year-item-selected" : ""}`}
                onClick={() => { setYear(y); setYearOpen(false); }}
              >
                {y}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="cal-weekdays">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} className="cal-weekday">{d}</div>
            ))}
          </div>
          <div className="cal-grid">
            {cells.map((cell, i) => {
              const state = getCellState(cell);
              return (
                <div
                  key={i}
                  className={`cal-cell${state !== "default" ? ` cal-cell-${state}` : ""}`}
                  onClick={() => handleClick(cell)}
                  onMouseEnter={() => !cell.outside && from && !to && setHovered(cell.date)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="cal-cell-inner">{cell.day}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="cal-footer">
        <button className="btn btn-ghost" onClick={onCancel}>
          <span className="btn-label">Cancel</span>
        </button>
        <button
          className="btn btn-accent"
          onClick={() => canApply && onApply({ from, to })}
          style={{ opacity: canApply ? 1 : 0.4, pointerEvents: canApply ? "auto" : "none" }}
        >
          <span className="btn-label">Apply</span>
        </button>
      </div>
    </div>
  );
}
