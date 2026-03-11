"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

function SnavItem({ icon, label, href, chevron, children }) {
  return (
    <div className="snav-item">
      {href ? (
        <Link href={href} className="snav-link">
          <div className="snav-icon">
            <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt={label} style={iconFilter} />
          </div>
          <span className="snav-label">{label}</span>
          {chevron && (
            <div className="snav-chevron">
              <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" />
            </div>
          )}
        </Link>
      ) : (
        <div className="snav-link">
          <div className="snav-icon">
            <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt={label} style={iconFilter} />
          </div>
          <span className="snav-label">{label}</span>
          {chevron && (
            <div className="snav-chevron">
              <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SnavSubitem({ icon, label, href, badge, active }) {
  return (
    <div className={`snav-subitem${active ? " active" : ""}`}>
      <div className="snav-tree"></div>
      <Link href={href || "#"} className="snav-sublink">
        <div className="snav-icon">
          <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt={label} style={iconFilter} />
        </div>
        <span className="snav-label">{label}</span>
        {badge != null && (
          <div className="snav-badge-wrap">
            <div className="snav-badge"><span>{badge}</span></div>
          </div>
        )}
      </Link>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav">
      {/* Header */}
      <div className="snav-header">
        <button className="snav-workspace-btn">
          <div className="snav-workspace-avatar">
            <img src="/images/Revolut_Logo.png" width={20} height={20} alt="Revolut" />
          </div>
          <span className="snav-workspace-name">Revolut</span>
        </button>
        <button className="btn btn-ghost btn-icon" title="Collapse sidebar">
          <img src="/icons/16px/SidebarLeft.svg" width={16} height={16} alt="Collapse sidebar" />
        </button>
      </div>

      {/* Section 1: Inbox + Contacts + Assistants */}
      <div className="snav-links">
        <SnavItem icon="Inbox" label="Inbox" chevron />
        <div className="snav-subitems">
          <SnavSubitem icon="User" label="Assigned to me" badge={4} href="/inbox" />
          <SnavSubitem icon="At" label="Mentions" badge={3} href="#" />
          <SnavSubitem icon="Unassigned" label="Unassigned" badge={3} href="#" />
          <SnavSubitem icon="Snooze" label="Snoozed" badge={2} href="#" />
          <SnavSubitem icon="CheckCircle" label="Closed" badge={3} href="#" />
          <SnavSubitem icon="All" label="All" badge={15} href="#" />
        </div>

        <SnavItem icon="ActiveUser" label="Contacts" chevron />
        <SnavItem icon="AI" label="AI Assistant" />
        <SnavItem icon="Micro" label="Voice Assist" />
      </div>

      <div className="snav-divider"></div>

      {/* Section 2: AI Hub */}
      <div className="snav-links mid">
        <SnavItem icon="AIHub" label="AI Hub" chevron />
        <div className="snav-subitems">
          <SnavSubitem icon="Documentation" label="Knowledge Base" href="#" />
          <SnavSubitem icon="Agent" label="Agent Assist" href="#" />
          <SnavSubitem icon="Workflows" label="AI Automation Agent" href="#" />
        </div>
      </div>

      <div className="snav-divider"></div>

      {/* Section 3: Analytics */}
      <div className="snav-links mid">
        <SnavItem icon="ChartBars" label="Analytics" chevron />
        <div className="snav-subitems">
          <SnavSubitem icon="Grid2" label="Overview" href="/overview" active={pathname === "/overview"} />
          <SnavSubitem icon="Verified" label="Agent QA" href="/agent-qa" active={pathname === "/agent-qa"} />
          <SnavSubitem icon="Users" label="Team Performance" href="#" />
          <SnavSubitem icon="Inbox" label="Conversations" href="#" />
          <SnavSubitem icon="User" label="Customers" href="#" />
        </div>
      </div>

      <div className="snav-divider"></div>

      {/* Section 4: Settings */}
      <div className="snav-links grow">
        <SnavItem icon="Toggle" label="Settings" />
      </div>

      {/* Footer */}
      <div className="snav-footer">
        <button className="snav-user-btn">
          <div className="snav-user-avatar">
            G<div className="snav-online-dot"></div>
          </div>
          <span className="snav-user-name">George White</span>
        </button>
      </div>
    </nav>
  );
}
