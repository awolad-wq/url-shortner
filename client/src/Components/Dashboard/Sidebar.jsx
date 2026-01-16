// import { NavLink, useNavigate } from "react-router-dom";
// import { use, useState } from "react";
// import useAxios from "../../Hooks/UseAxios";
// import { FaArrowLeft } from "react-icons/fa";
// import { FaArrowRight } from "react-icons/fa";
// import { RxDashboard } from "react-icons/rx";
// import { FaHistory } from "react-icons/fa";
// import { ImStatsDots } from "react-icons/im";
// import { CgProfile } from "react-icons/cg";
// import { MdOutlineLogout } from "react-icons/md";
// import { USER_MENU, ADMIN_MENU } from "../../Config/SidebarMenu";
// import { useAuth } from "../../Context/AuthContext";



// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const axios = useAxios();

//   const { user, setUser } = useAuth();

//   async function handleLogout() {
//     try {
//       await axios.post("/auth/logout", {}, { withCredentials: true });
//     } catch {}
//     setUser(null);
//     window.location.href = "/login";
//   }

//   const menu = user?.role === "ADMIN" ? ADMIN_MENU : USER_MENU;

//   // const menu = [
//   //   { name: "Dashboard", path: "/dashboard", icon: <RxDashboard /> },
//   //   { name: "History", path: "/dashboard/history", icon: <FaHistory /> },
//   //   // { name: "Statistics", path: "/dashboard/statistics", icon: <ImStatsDots /> },
//   //   { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
//   // ];

//   return (
//     <aside
//       className={`bg-white border-r  flex flex-col transition-all duration-300
//       ${collapsed ? "w-20" : "w-64"}`}
//     >
//       {/* Logo */}
//       <div className="h-16 flex items-center justify-between px-4 border-b">
//         {!collapsed && <h1 className="font-bold text-lg">Apar's Link Shortener</h1>}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="p-2 rounded-lg hover:bg-slate-100"
//         >
//           {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
//         </button>
//       </div>

//       {/* User */}
//       <div className="px-4 py-4 border-b">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
//             {user?.name?.[0] || "U"}
//           </div>

//           {!collapsed && (
//             <div className="leading-tight">
//               <p className="font-medium">{user?.name || "User"}</p>
//               <p className="text-xs text-slate-500">{user?.email}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 px-3 py-4 space-y-1">
//         {menu.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             end
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition
//               ${
//                 isActive
//                   ? "bg-slate-900 text-white"
//                   : "text-slate-600 hover:bg-slate-100"
//               }`
//             }
//           >
//             <span className="text-lg">{item.icon}</span>
//             {!collapsed && item.name}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Logout */}
//       <div className="p-3 border-t">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
//         >
//           <span className="text-lg"><MdOutlineLogout /></span>
//           {!collapsed && "Logout"}
//         </button>
//       </div>
//     </aside>
//   );
// }

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
