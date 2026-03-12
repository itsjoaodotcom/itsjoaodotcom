"use client";

const DotSvg = () => (
  <span className="tag-dot">
    <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
      <rect width="7" height="7" rx="3.5" fill="currentColor" />
    </svg>
  </span>
);

export default function Tag({
  color = "blue",
  size = "default",
  style = "ghost",
  label,
  iconLeft = true,
  iconRight = false,
  icon12Left,
  icon12Right,
}) {
  const classes = [
    "tag",
    `tag-${color}`,
    style === "filled" ? "tag-filled" : "",
    size === "sm" ? "tag-sm" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {iconLeft && (icon12Left || <DotSvg />)}
      {label && <span className="tag-label">{label}</span>}
      {iconRight && (icon12Right || <DotSvg />)}
    </span>
  );
}
