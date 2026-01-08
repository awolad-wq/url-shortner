import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HistoryCrad = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API}/${item.alias}`;

  async function copy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (

    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4 w-full max-w-3xl overflow-hidden">

      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-800 truncate break-all">
          {item.originalUrl}
        </p>

        <Link to={shortUrl} className="text-blue-600 text-sm truncate block break-all">
          {shortUrl}
        </Link>
      </div>

      <button
        onClick={copy}
        className={`px-4 py-2 rounded-xl text-sm font-medium border cursor-pointer transition 
        ${copied
            ? "bg-green-600 text-white border-green-600"
            : "bg-slate-900 text-white hover:bg-slate-800 border-slate-900"
          }`}
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>

      <Link
        to={`/stats/${item.alias}`}
        className="shrink-0 text-sm border px-4 py-2 rounded-lg whitespace-nowrap"
      >
        Details →
      </Link>
    </div>



  );
};

export default HistoryCrad;