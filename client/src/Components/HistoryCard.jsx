import React from 'react';
import { Link } from 'react-router-dom';

const HistoryCrad = ({ item }) => {
  const shortUrl = `${import.meta.env.VITE_API}/${item.alias}`;
  return (

    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4 w-full max-w-3xl overflow-hidden">

      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-800 truncate break-all">
          {item.originalUrl}
        </p>

        <a className="text-blue-600 text-sm truncate block break-all">
          {shortUrl}
        </a>
      </div>

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