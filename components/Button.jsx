export default function Button({
  variant = "accent",   // accent | inverse | secondary | ghost | destructive | ghost-destructive
  size = "default",     // default | sm | micro
  label = "Button",
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
      {iconOnly ? (
        <img src="/icons/16px/Plus.svg" alt="" style={{ filter: "inherit" }} />
      ) : (
        <span className="btn-label">{label}</span>
      )}
    </button>
  );
}
