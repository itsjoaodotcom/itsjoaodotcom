export default function Button({
  variant = "accent",
  size = "default",
  label = "Button",
  iconLeft = true,
  iconRight = false,
  iconOnly = false,
  disabled = false,
  loading = false,
}) {
  const cls = [
    "btn",
    `btn-${variant}`,
    size !== "default" ? `btn-${size}` : "",
    iconOnly ? "btn-icon" : "",
    loading ? "is-loading" : "",
    disabled ? "is-disabled" : "",
  ].filter(Boolean).join(" ");

  return (
    <button className={cls} disabled={disabled || loading}>
      {(iconOnly || iconLeft) && <img src="/icons/16px/Plus.svg" alt="" />}
      {!iconOnly && <span className="btn-label">{label}</span>}
      {!iconOnly && iconRight && <img src="/icons/16px/Plus.svg" alt="" />}
    </button>
  );
}
