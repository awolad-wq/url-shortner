import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { USER_MENU, ADMIN_MENU } from "../../Config/SidebarMenu"
import { useAuth } from "../../Context/AuthContext"
import useAxios from "../../Hooks/UseAxios";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { user, setUser } = useAuth();
  const axios = useAxios();

  const menu = user?.role === "ADMIN" ? ADMIN_MENU : USER_MENU;

  async function handleLogout() {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch {}
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <aside
      className={`h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {open && (
          <div>
            <h1 className="font-bold text-lg">Apar's Link Shortener</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        )}

        <button onClick={() => setOpen(!open)}>
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {menu.map((item, i) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-slate-700"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {open && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut size={18} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
