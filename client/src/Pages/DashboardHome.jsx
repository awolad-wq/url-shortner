import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../Hooks/UseAxios";


export default function DashboardHome() {
  const axios = useAxios();

  const [overview, setOverview] = useState(null);
  const [topLinks, setTopLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const res = await axios.get("/user/stats", {
        withCredentials: true,
      });

      if (!res.data.success) throw new Error("Failed to load stats");

      setOverview(res.data.data.overview);
      setTopLinks(res.data.data.topLinks || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500 text-sm">
          Overview of your short links performance
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Total Links" value={overview.totalLinks} />
        <StatCard title="Active Links" value={overview.activeLinks} />
        <StatCard title="Expired Links" value={overview.expiredLinks} />
        <StatCard title="Broken Links" value={overview.brokenLinks} />
        <StatCard title="Total Clicks" value={overview.totalClicks} />
        <StatCard title="Recent Clicks" value={overview.recentClicks} />
      </div>

      {/* Top links */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Top links</h2>
          <Link
            to="/dashboard/history"
            className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
          >
            View all
          </Link>
        </div>

        {topLinks.length === 0 && (
          <p className="text-slate-500 text-sm">No links found.</p>
        )}

        {topLinks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 border-b">
                <tr>
                  <th className="text-left py-2 font-medium">Short link</th>
                  <th className="text-left py-2 font-medium">Original URL</th>
                  <th className="text-left py-2 font-medium">Clicks</th>
                  <th className="text-left py-2 font-medium">Created</th>
                </tr>
              </thead>

              <tbody>
                {topLinks.map((link) => {
                  const shortUrl = `${import.meta.env.VITE_API}/${link.alias}`;

                  return (
                    <tr key={link.alias} className="border-b last:border-0">
                      <td className="py-3 font-medium text-blue-600">
                        <a href={shortUrl} target="_blank" rel="noreferrer">
                          {shortUrl}
                        </a>
                      </td>
                      <td className="py-3 text-slate-500 truncate max-w-xs">
                        {link.originalUrl}
                      </td>
                      <td className="py-3">{link.clicks}</td>
                      <td className="py-3">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

/* ---------- Small stat card component ---------- */

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
