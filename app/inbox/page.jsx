"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import InboxContent from "./InboxContent";

export default function InboxPage() {
  const [currentView, setCurrentView] = useState("assigned");

  return (
    <div className="frame-root">
      <Sidebar variant="inbox" activeView={currentView} onViewChange={setCurrentView} />
      <InboxContent currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}
