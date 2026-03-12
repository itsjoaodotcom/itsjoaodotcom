"use client";

import Sidebar from "../../components/Sidebar";
import { ShellProvider, useShell } from "../../components/ShellContext";

function ShellInner({ children }) {
  const { activeView, setActiveView } = useShell();

  return (
    <div className="frame-root">
      <Sidebar variant="inbox" activeView={activeView} onViewChange={setActiveView} />
      {children}
    </div>
  );
}

export default function ShellLayout({ children }) {
  return (
    <ShellProvider>
      <ShellInner>{children}</ShellInner>
    </ShellProvider>
  );
}
