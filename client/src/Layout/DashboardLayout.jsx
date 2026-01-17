import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Dashboard/Sidebar";


export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
