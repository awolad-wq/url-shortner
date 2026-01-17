// import { Link, Outlet } from "react-router-dom";
// import Sidebar from "../Components/Dashboard/Sidebar";

// const Dashboard = () => {
//   return (
//     <div className="min-h-screen bg-slate-50">

//       {/* Top bar */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <h1 className="text-xl font-bold">Dashboard</h1>

//           <div className="flex items-center gap-3">
//             <Link
//               to="/"
//               className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800"
//             >
//               + New short link
//             </Link>

//             <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
//               S
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

//         {/* Stats */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[
//             { label: "Total Links", value: "128" },
//             { label: "Total Clicks", value: "4,392" },
//             { label: "Active Links", value: "117" },
//             { label: "Expired Links", value: "11" },
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-2xl shadow-sm border p-5"
//             >
//               <p className="text-sm text-slate-500">{item.label}</p>
//               <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
//               <p className="text-xs text-green-600 mt-1">+12% this month</p>
//             </div>
//           ))}
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <h2 className="text-xl font-semibold">Your links</h2>

//           <div className="flex gap-3">
//             <input
//               placeholder="Search links..."
//               className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
//             />

//             <select className="border rounded-xl px-3 py-2 text-sm">
//               <option>All</option>
//               <option>Active</option>
//               <option>Expired</option>
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-slate-100 text-slate-600">
//               <tr>
//                 <th className="text-left px-5 py-3 font-medium">Short link</th>
//                 <th className="text-left px-5 py-3 font-medium">Original URL</th>
//                 <th className="text-left px-5 py-3 font-medium">Clicks</th>
//                 <th className="text-left px-5 py-3 font-medium">Status</th>
//                 <th className="text-right px-5 py-3 font-medium">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <tr key={i} className="border-t hover:bg-slate-50">
//                   <td className="px-5 py-3 font-medium text-blue-600">
//                     cutly.io/abc{i}
//                   </td>
//                   <td className="px-5 py-3 text-slate-500 truncate max-w-xs">
//                     https://example.com/some/really/long/url/{i}
//                   </td>
//                   <td className="px-5 py-3">234</td>
//                   <td className="px-5 py-3">
//                     <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
//                       Active
//                     </span>
//                   </td>
//                   <td className="px-5 py-3 text-right space-x-3">
//                     <Link
//                       to="/stats/test"
//                       className="text-slate-600 hover:text-slate-900"
//                     >
//                       Analytics
//                     </Link>
//                     <button className="text-red-500 hover:underline">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Dashboard;
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
