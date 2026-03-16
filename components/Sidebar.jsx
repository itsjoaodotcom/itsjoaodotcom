"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

const VIEW_MAP = {
  "Assigned to me": "assigned",
  "Mentions": "mentions",
  "Unassigned": "unassigned",
  "Snoozed": "snoozed",
  "Closed": "closed",
  "All": "all",
};

/* ─── Nav item (top level) ─── */
function SnavItem({ icon, label, href, chevron, expanded, onToggle }) {
  const router = useRouter();

  const handleClick = () => {
    if (onToggle) {
      onToggle();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <div className={`snav-item${expanded ? " expanded" : ""}`}>
      <div
        className="snav-link"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div className="snav-icon">
          <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt={label} style={iconFilter} />
        </div>
        <span className="snav-label">{label}</span>
        {chevron && (
          <div className="snav-chevron">
            <img
              src={`/icons/16px/${expanded ? "ChevronBottom" : "ChevronRight"}.svg`}
              width={16} height={16} alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Nav subitem ─── */
function SnavSubitem({ icon, label, href, badge, active, onClick }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
    if (href && href !== "#") router.push(href);
  };

  return (
    <div className={`snav-subitem${active ? " active" : ""}`}>
      <div className="snav-tree"></div>
      <div
        className="snav-sublink"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div className="snav-icon">
          <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt={label} style={iconFilter} />
        </div>
        <span className="snav-label">{label}</span>
        {badge != null && (
          <div className="snav-badge-wrap">
            <div className="snav-badge"><span>{badge}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Collapsible nav group ─── */
function NavGroup({ icon, label, defaultExpanded = false, hrefs = [], children }) {
  const pathname = usePathname();
  const matchesRoute = hrefs.some((h) => pathname.startsWith(h));
  const [expanded, setExpanded] = useState(defaultExpanded || matchesRoute);

  return (
    <>
      <SnavItem
        icon={icon}
        label={label}
        chevron
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      />
      {expanded && (
        <div className="snav-subitems">
          {children}
        </div>
      )}
    </>
  );
}

/* ─── Inbox subitems (with view switching) ─── */
function InboxSubitems({ activeView, onViewChange }) {
  const pathname = usePathname();
  const isInbox = pathname === "/inbox";

  const items = [
    { icon: "User", label: "Assigned to me", badge: 6 },
    { icon: "At", label: "Mentions" },
    { icon: "Unassigned", label: "Unassigned", badge: 36 },
    { icon: "Snooze", label: "Snoozed", badge: 3 },
    { icon: "CheckCircle", label: "Closed", badge: 138 },
    { icon: "Users", label: "Teams inboxes", badge: 138 },
    { icon: "Inbox", label: "All", badge: 34 },
  ];

  return items.map((item) => {
    const view = VIEW_MAP[item.label];
    return (
      <SnavSubitem
        key={item.label}
        icon={item.icon}
        label={item.label}
        badge={item.badge}
        href="/inbox"
        active={isInbox && activeView === view}
        onClick={onViewChange ? () => onViewChange(view) : undefined}
      />
    );
  });
}

function ContactsSubitems() {
  return (
    <>
      <SnavSubitem icon="Users" label="All" />
      <SnavSubitem icon="Users" label="Active" />
    </>
  );
}

function AgentsQaSubitems() {
  const pathname = usePathname();

  return (
    <>
      <SnavSubitem icon="Verified" label="Scoring Agents" badge={6} href="/scoring-agents" active={pathname.startsWith("/scoring-agents")} />
      <SnavSubitem icon="ChartBars" label="Analytics" />
    </>
  );
}

function AiHubSubitems() {
  return (
    <>
      <SnavSubitem icon="Documentation" label="Knowledge Base" />
      <SnavSubitem icon="Agent" label="Agent Assist" />
      <SnavSubitem icon="Workflows" label="AI Automation Agent" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  Sidebar variants                                          */
/* ═══════════════════════════════════════════════════════════ */


function SidebarInbox({ collapsed, onCollapse, activeView, onViewChange }) {
  return (
    <nav className={`sidebar-nav${collapsed ? " collapsed" : ""}`}>
      <SidebarHeader onCollapse={onCollapse} />

      <div className="snav-links">
        <NavGroup icon="Inbox" label="Inbox" defaultExpanded hrefs={["/inbox"]}>
          <InboxSubitems activeView={activeView} onViewChange={onViewChange} />
        </NavGroup>
        <NavGroup icon="Users" label="Contacts">
          <ContactsSubitems />
        </NavGroup>
      </div>

      <div className="snav-divider"></div>

      <div className="snav-links mid">
        <SnavItem icon="AI" label="AI Assistant" />
        <SnavItem icon="Micro" label="Voice Assist" />
      </div>

      <div className="snav-divider"></div>

      <div className="snav-links mid">
        <NavGroup icon="AIHub" label="AI Hub">
          <AiHubSubitems />
        </NavGroup>
      </div>

      <div className="snav-divider"></div>

      <div className="snav-links mid">
        <NavGroup icon="One part" label="Agents QA" hrefs={["/scoring-agents"]}>
          <AgentsQaSubitems />
        </NavGroup>
      </div>

      <div className="snav-divider"></div>

      <div className="snav-divider"></div>

<div className="snav-links grow">
        <SnavItem icon="Toggle" label="Settings" />
      </div>

      <SidebarFooter />
    </nav>
  );
}


function SidebarOverview({ collapsed, onCollapse }) {
  return (
    <nav className={`sidebar-nav${collapsed ? " collapsed" : ""}`}>
      <SidebarHeader onCollapse={onCollapse} />

      <div className="snav-links">
        <NavGroup icon="Inbox" label="Inbox" defaultExpanded>
          <InboxSubitems />
        </NavGroup>
        <NavGroup icon="ActiveUser" label="Contacts">
          <ContactsSubitems />
        </NavGroup>
        <SnavItem icon="AI" label="AI Assistant" />
        <SnavItem icon="Micro" label="Voice Assist" />
      </div>

      <div className="snav-divider"></div>

      <div className="snav-links mid">
        <NavGroup icon="AIHub" label="AI Hub">
          <AiHubSubitems />
        </NavGroup>
      </div>

      <div className="snav-divider"></div>

      <div className="snav-links mid">
        <NavGroup icon="ChartBars" label="Analytics" defaultExpanded hrefs={["/overview"]}>
          <SnavSubitem icon="Grid2" label="Overview" href="/overview" />
          <SnavSubitem icon="AI" label="AI Insights" />
          <SnavSubitem icon="Users" label="Team Performance" />
          <SnavSubitem icon="Inbox" label="Conversations" />
          <SnavSubitem icon="User" label="Customers" />
        </NavGroup>
      </div>

      <div className="snav-divider"></div>

      <div className="snav-links grow">
        <SnavItem icon="Toggle" label="Settings" />
      </div>

      <SidebarFooter />
    </nav>
  );
}

/* ─── Shared parts ─── */

function SidebarHeader({ onCollapse }) {
  return (
    <div className="snav-header">
      <button className="snav-workspace-btn">
        <div className="snav-workspace-avatar">
          <img src="/images/Revolut_Logo.png" width={20} height={20} alt="Revolut" />
        </div>
        <span className="snav-workspace-name">Revolut</span>
      </button>
      <button
        className="btn btn-ghost btn-icon"
        title="Collapse sidebar"
        onClick={onCollapse}
      >
        <img src="/icons/16px/SidebarLeft.svg" width={16} height={16} alt="Collapse sidebar" />
      </button>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="snav-footer">
      <button className="snav-user-btn">
        <div className="snav-user-avatar">
          G<div className="snav-online-dot"></div>
        </div>
        <span className="snav-user-name">George White</span>
      </button>
    </div>
  );
}

/* ─── Main export ─── */

export default function Sidebar({ variant = "overview", activeView, onViewChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed((c) => !c);

  switch (variant) {
    case "inbox":
      return (
        <SidebarInbox
          collapsed={collapsed}
          onCollapse={toggleCollapse}
          activeView={activeView}
          onViewChange={onViewChange}
        />
      );
    case "overview":
    default:
      return <SidebarOverview collapsed={collapsed} onCollapse={toggleCollapse} />;
  }
}
