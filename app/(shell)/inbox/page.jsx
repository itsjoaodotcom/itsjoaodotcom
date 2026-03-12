"use client";

import { useShell } from "../../../components/ShellContext";
import InboxContent from "./InboxContent";

export default function InboxPage() {
  const { activeView, setActiveView } = useShell();

  return <InboxContent currentView={activeView} onViewChange={setActiveView} />;
}
