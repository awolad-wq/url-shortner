import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAxios from "../Hooks/UseAxios";


export default function LinkStats() {
  const { alias } = useParams();
  const axios = useAxios();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, [alias]);

  async function loadStats() {
    try {
      setLoading(true);

      const res = await axios.get(`/${alias}/stats`, {
        withCredentials: true,
      });

      if (!res.data.success) throw new Error("Failed to fetch stats");

      setData(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-slate-500">Loading analytics...</div>;
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

  const shortUrl = `${import.meta.env.VITE_API}/${data.alias}`;

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Link Analytics</h1>
          <p className="text-slate-500 text-sm">
            Detailed performance of your short link
          </p>
        </div>

        <Link
          to="/dashboard/history"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to history
        </Link>
      </div>

      {/* Link card */}
      <div className="bg-white border rounded-2xl p-6 space-y-2 shadow-sm">
        <p className="text-sm text-slate-500">Short link</p>
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 font-semibold text-lg break-all"
        >
          {shortUrl}
        </a>

        <p className="text-sm text-slate-500 mt-2">Original URL</p>
        <p className="break-all">{data.originalUrl}</p>

        <div className="flex flex-wrap gap-2 pt-3">
          {data.isActive && (
            <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700">
              Active
            </span>
          )}
          {data.isExpired && (
            <span className="px-2 py-1 text-xs rounded-md bg-orange-100 text-orange-700">
              Expired
            </span>
          )}
          {data.isBroken && (
            <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700">
              Broken
            </span>
          )}
        </div>
      </div>

      {/* Overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Total Clicks" value={data.analytics.totalClicks} />
        <StatCard title="Last 7 Days" value={data.analytics.clicksLast7Days} />
        <StatCard title="Last 30 Days" value={data.analytics.clicksLast30Days} />
      </div>

      {/* Clicks by day */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Clicks by day</h2>

        {Object.keys(data.analytics.clicksByDay).length === 0 && (
          <p className="text-sm text-slate-500">No click data yet.</p>
        )}

        <div className="space-y-2">
          {Object.entries(data.analytics.clicksByDay).map(([day, count]) => (
            <div
              key={day}
              className="flex justify-between border-b last:border-0 py-2 text-sm"
            >
              <span className="text-slate-600">{day}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Owner */}
      {/* <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-3">Owner</h2>
        <p><b>Name:</b> {data.owner.name}</p>
        <p><b>Email:</b> {data.owner.email}</p>
      </div> */}
    </div>
  );
}

/* Small reusable stat card */
function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );
}
