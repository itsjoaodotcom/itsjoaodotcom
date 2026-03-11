import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children }) {
  return (
    <div className="frame-root voc-layout">
      <Topbar />
      <div className="voc-body">
        <Sidebar />
        <main className="voc-main">{children}</main>
      </div>
    </div>
  );
}
