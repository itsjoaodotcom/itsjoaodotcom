"use client";

import { forwardRef } from "react";

/**
 * Input component matching the design system.
 *
 * Props:
 * - label        — optional label text above the input
 * - caption      — optional caption text below the input
 * - error        — if true, shows error state (red border + red caption)
 * - disabled     — disabled state (opacity 0.3)
 * - iconLeft     — optional ReactNode rendered before the text
 * - button       — optional ReactNode rendered as trailing action (e.g. chevron)
 * - textArea     — if true renders a textarea instead of input
 * - className    — class for the outer wrapper
 * - All other props forwarded to the native <input> or <textarea>
 */
const Input = forwardRef(function Input(
  { label, caption, error = false, disabled = false, iconLeft, button, textArea = false, className, onClick, onMouseDown, ...rest },
  ref
) {
  const Tag = textArea ? "textarea" : "input";
  const isClickable = onClick || onMouseDown;

  return (
    <div className={`input-field ${className || ""}`}>
      {label && <label className="input-label">{label}</label>}
      <div
        className={`input-wrap${error ? " input-wrap-error" : ""}${disabled ? " input-wrap-disabled" : ""}${isClickable ? " input-wrap-clickable" : ""}`}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        {iconLeft && <span className="input-icon-left">{iconLeft}</span>}
        <Tag
          ref={ref}
          className={`input-native${textArea ? " input-native-textarea" : ""}`}
          disabled={disabled}
          {...rest}
        />
        {button && <span className="input-button">{button}</span>}
      </div>
      {caption && <p className={`input-caption${error ? " input-caption-error" : ""}`}>{caption}</p>}
    </div>
  );
});

export default Input;
