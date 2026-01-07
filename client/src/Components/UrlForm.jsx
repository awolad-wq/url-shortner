import React, { useState } from 'react';
import useAxios from '../Hooks/UseAxios';

const UrlForm = ({onSuccess}) => {
  
  const axios = useAxios();
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/shorten", {
        originalUrl: url,
        customAlias: alias || undefined,
      });

      // console.log(res);

      if (!res.data.success) throw new Error(res.data.message);

      onSuccess(res.data.data);
      setUrl("");
      setAlias("");
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Inavlid URL"
      );

      return
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Paste a long URL</label>
        <input
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very-long-url"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Custom Short-Code (optional)</label>
        <input
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="my-link"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        disabled={loading}
        className="w-full bg-slate-600 shadow-lg shadow-slate-500/60 cursor-pointer text-white py-2 rounded-lg hover:bg-slate-900 disabled:opacity-60"
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </button>

    </form>
  );
};

export default UrlForm;