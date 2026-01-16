import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../Hooks/UseAxios";


export default function History() {
  const axios = useAxios();

  const [links, setLinks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    try {
      setLoading(true);
      const res = await axios.get("/user/links", {
        withCredentials: true,
      });

      if (!res.data.success) throw new Error("Failed to fetch links");

      setLinks(res.data.data.links);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load history"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(alias) {
    const ok = confirm("Are you sure you want to delete this short link?");
    if (!ok) return;

    try {
      await axios.delete(`/${alias}`, {
        withCredentials: true,
      });

      setLinks((prev) => prev.filter((l) => l.alias !== alias));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete link"
      );
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading history...</p>
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
    <div className="p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-slate-500 text-sm">
            All your shortened links in one place
          </p>
        </div>

        <Link
          to="/"
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
        >
          + Create link
        </Link>
      </div>

      {/* Empty state */}
      {links.length === 0 && (
        <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
          <p className="text-slate-600 font-medium">No links found</p>
          <p className="text-slate-400 text-sm mt-1">
            Start by creating your first short link.
          </p>
        </div>
      )}

      {/* Table */}
      {links.length > 0 && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Short link</th>
                <th className="text-left px-5 py-3 font-medium">Original URL</th>
                <th className="text-left px-5 py-3 font-medium">Created</th>
                <th className="text-left px-5 py-3 font-medium">Expires</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {links.map((link) => {
                const shortUrl = `${import.meta.env.VITE_API.replace("/api/v1","")}/${link.alias}`;

                return (
                  <tr
                    key={link.alias}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-5 py-3 font-medium text-blue-600 truncate max-w-[180px]">
                      <a href={shortUrl} target="_blank" rel="noreferrer">
                        {shortUrl}
                      </a>
                    </td>

                    <td className="px-5 py-3 text-slate-500 truncate max-w-xs">
                      {link.originalUrl}
                    </td>

                    <td className="px-5 py-3">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-3">
                      {new Date(link.expiresAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-3">
                      {link.isActive ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                          Expired
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3 text-right space-x-3">
                      {/* Analytics */}
                      <button
                        onClick={() =>
                          navigate(`/dashboard/stats/${link.alias}`)
                        }
                        className="px-3 py-1.5 rounded-lg border text-xs hover:bg-slate-100"
                      >
                        Analytics
                      </button>

                      <button onClick={() => handleDelete(link.alias)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination info (ready for later buttons) */}
      {pagination && (
        <div className="text-xs text-slate-400 text-right">
          Page {pagination.page} of {pagination.pages} • Total {pagination.total}
        </div>
      )}
    </div>
  );
}
