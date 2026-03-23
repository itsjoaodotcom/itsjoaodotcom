"use client";

/**
 * Toggle component matching the design system.
 *
 * Props:
 * - on        — boolean, controlled toggle state
 * - onChange  — callback when toggled
 * - disabled  — disabled state
 * - className — optional extra class on the outer wrapper
 */
export default function Toggle({ on = false, onChange, disabled = false, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      className={`toggle ${on ? "toggle-on" : "toggle-off"}${disabled ? " toggle-disabled" : ""} ${className || ""}`}
      onClick={() => onChange && onChange(!on)}
    >
      <span className="toggle-knob" />
    </button>
  );
}
