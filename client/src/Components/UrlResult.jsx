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
    <div className="mt-6 bg-white border rounded-xl p-4 space-y-2">
      <p className="text-sm text-slate-500">Your short link</p>

      <div className="flex items-center justify-between gap-3">
        <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-medium truncate">
          {shortUrl}
        </a>

        <button
          onClick={copy}
          className="border px-3 py-1.5 rounded-lg hover:bg-slate-100 text-sm"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <Link to={`/stats/${result.alias}`} className="text-sm text-blue-600 hover:underline">
        View analytics →
      </Link>
    </div>
  );
};

export default UrlResult;