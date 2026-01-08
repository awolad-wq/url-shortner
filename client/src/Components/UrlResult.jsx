import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UrlResult = ({ result }) => {

  const [copied, setCopied] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API}/${result.alias}`;

  async function copy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }


  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">
          Your short link is ready
        </p>

        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 mb-1">Short URL</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-lg font-semibold text-blue-600 hover:underline truncate"
          >
            {shortUrl}
          </a>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copy}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition 
        ${copied
                ? "bg-green-600 text-white border-green-600"
                : "bg-slate-900 text-white hover:bg-slate-800 border-slate-900"
              }`}
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>

          <Link
            to={`/stats/${result.alias}`}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-300 hover:bg-slate-100"
          >
            Analytics
          </Link>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t flex flex-wrap gap-4 text-xs text-slate-500">
        <span>Alias: <b className="text-slate-700">{result.alias}</b></span>
        <span>Expires: <b className="text-slate-700">
          {new Date(result.expiresAt).toLocaleDateString()}
        </b></span>
      </div>

    </div>

  );
};

export default UrlResult;