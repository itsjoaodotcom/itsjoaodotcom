import Popover from "../components/Popover";

const userSections = [
  [
    { label: "Caroline Brennan", avatar: "/avatars/Avatar 01.png" },
    { label: "Michael Thompson", avatar: "/avatars/Avatar 2.png" },
    { label: "Aisha Patel",      avatar: "/avatars/Avatar 3.png" },
    { label: "Jamal Rodriguez",  avatar: "/avatars/Avatar 4.png" },
    { label: "Naomi Watts",      avatar: "/avatars/Avatar 5.png" },
    { label: "Daniel Moore",     avatar: "/avatars/Avatar 6.png" },
    { label: "Priya Sharma",     avatar: "/avatars/Avatar 7.png" },
    { label: "Marcus Lee",       avatar: "/avatars/Avatar 8.png" },
  ],
  [
    { label: "Tom Harrison",  avatar: "/avatars/Avatar 9.png" },
    { label: "Leila Nasser",  avatar: "/avatars/Avatar 10.png" },
    { label: "Sam Chen",      avatar: "/avatars/Avatar 11.png" },
    { label: "Fiona Blake",   avatar: "/avatars/Avatar 12.png" },
  ],
  [
    { label: "Omar Farid",  avatar: "/avatars/Avatar 13.png" },
    { label: "Nina Volkov", avatar: "/avatars/Avatar 14.png" },
  ],
];

const textSections = [
  [
    { label: "Bug",         icon: "/icons/16px/Flag.svg" },
    { label: "Feature",     icon: "/icons/16px/Plus.svg" },
    { label: "Improvement", icon: "/icons/16px/Check.svg" },
    { label: "Design",      icon: "/icons/16px/Magaphone.svg" },
  ],
  [
    { label: "Blocked",   icon: "/icons/16px/Flag.svg" },
    { label: "In Review", icon: "/icons/16px/CheckCircle.svg" },
  ],
  [
    { label: "Archived", icon: "/icons/16px/Trash.svg" },
  ],
];

export const registry = [
  {
    slug: "popover",
    name: "Popover",
    category: "Overlay",
    component: Popover,
    defaultProps: {
      content: "users",
      placeholder: "Find or create a user...",
      drag: false,
      checkbox: false,
      bottomActions: false,
      scrollLoader: false,
    },
    controls: [
      { key: "content",       label: "Content",        type: "select",  options: ["users", "text"] },
      { key: "drag",          label: "Drag",           type: "toggle" },
      { key: "checkbox",      label: "Checkbox",       type: "toggle" },
      { key: "_section2",     label: "2nd section",    type: "toggle",  default: false },
      { key: "_section3",     label: "3rd section",    type: "toggle",  default: false },
      { key: "bottomActions", label: "Bottom actions", type: "toggle" },
      { key: "scrollLoader",  label: "ScrollLoader",   type: "toggle" },
    ],
    computeProps(defaultProps, vals) {
      const content = vals.content ?? defaultProps.content;
      const source = content === "text" ? textSections : userSections;
      const count = 1 + (vals._section2 ? 1 : 0) + (vals._section3 ? 1 : 0);
      const { _section2, _section3, ...rest } = vals;
      return { ...defaultProps, ...rest, sections: source.slice(0, count) };
    },
  },
];

export const legacyLinks = [
  { slug: "button",        name: "Button",        category: "Actions",  href: "/components/button" },
  { slug: "tag",           name: "Tag",            category: "Display",  href: "/components/tag" },
  { slug: "dialog-alert",  name: "Dialog Alert",   category: "Feedback", href: "/components/dialog-alert" },
  { slug: "empty-state",   name: "Empty State",    category: "Feedback", href: "/components/empty-state" },
  { slug: "data-selector", name: "Data Selector",  category: "Forms",    href: "/components/data-selector" },
];

export function getComponent(slug) {
  return registry.find((c) => c.slug === slug) ?? null;
}

export function getComponentName(slug) {
  const r = registry.find((c) => c.slug === slug);
  if (r) return r.name;
  const l = legacyLinks.find((c) => c.slug === slug);
  return l?.name ?? slug;
}

export const totalCount = registry.length + legacyLinks.length;
