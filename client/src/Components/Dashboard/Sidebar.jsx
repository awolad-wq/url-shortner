import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAxios from "../../Hooks/UseAxios";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { FaHistory } from "react-icons/fa";
import { ImStatsDots } from "react-icons/im";
import { CgProfile } from "react-icons/cg";


export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const axios = useAxios();

  const user = JSON.parse(localStorage.getItem("user"));

  async function handleLogout() {
    try {
      // if you have logout api, call it:
      await axios.post("/auth/logout", {}, { withCredentials: true });

      localStorage.removeItem("user");
      navigate("/login");
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <RxDashboard /> },
    { name: "History", path: "/dashboard/history", icon: <FaHistory /> },
    { name: "Statistics", path: "/dashboard/statistics", icon: <ImStatsDots /> },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
  ];

  return (
    <aside
      className={`bg-white border-r h-screen flex flex-col transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && <h1 className="font-bold text-lg">Apar's Link Shortener</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
            {user?.name?.[0] || "U"}
          </div>

          {!collapsed && (
            <div className="leading-tight">
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition
              ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <span className="text-lg">🚪</span>
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
