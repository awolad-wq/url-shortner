import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../Hooks/UseAxios";


export default function AdminLinks() {
  const axios = useAxios();
  const navigate = useNavigate();

  const [links, setLinks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLinks(page);
  }, [page]);

  async function loadLinks(pageNumber = 1) {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`/admin/links?page=${pageNumber}`, {
        withCredentials: true,
      });

      if (!res.data.success) throw new Error("Failed to load admin links");

      setLinks(res.data.data.links || []);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load admin links"
      );
    } finally {
      setLoading(false);
    }
  }

  

  if (loading) {
    return <div className="p-8 text-slate-500">Loading admin links...</div>;
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
      <div>
        <h1 className="text-2xl font-bold">All Links (Admin)</h1>
        <p className="text-slate-500 text-sm">
          Manage and monitor all user-generated short links
        </p>
      </div>

      {/* Empty state */}
      {links.length === 0 && (
        <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
          No links found.
        </div>
      )}

      {/* Table */}
      {links.length > 0 && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-slate-600">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Short</th>
                <th className="px-5 py-3 text-left font-medium">Original URL</th>
                <th className="px-5 py-3 text-left font-medium">Owner</th>
                <th className="px-5 py-3 text-left font-medium">Clicks</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Created</th>
                {/* <th className="px-5 py-3 text-right font-medium">Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {links.map((link) => {
                const shortUrl = `${import.meta.env.VITE_API
                  }/${link.alias}`;

                return (
                  <tr
                    key={link.alias}
                    className="border-b last:border-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-5 py-4 font-medium text-blue-600">
                      <a href={shortUrl} target="_blank" rel="noreferrer">
                        {link.alias}
                      </a>
                    </td>

                    <td className="px-5 py-4 max-w-xs truncate text-slate-600">
                      {link.originalUrl}
                    </td>

                    <td className="px-5 py-4">
                      <div className="leading-tight">
                        <p className="font-medium">{link.owner.name}</p>
                        <p className="text-xs text-slate-500">
                          {link.owner.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">{link.clicks}</td>

                    <td className="px-5 py-4 space-x-1">
                      {link.isActive && (
                        <span className="px-2 py-1 rounded-md text-xs bg-green-100 text-green-700">
                          Active
                        </span>
                      )}
                      {link.isBroken && (
                        <span className="px-2 py-1 rounded-md text-xs bg-red-100 text-red-700">
                          Broken
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>

                    {/* <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/stats/${link.alias}`)
                        }
                        className="px-3 py-1.5 rounded-lg border text-xs hover:bg-slate-100"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(link.alias)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (basic) */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-end gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1.5 text-sm text-slate-600">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            disabled={page === pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
