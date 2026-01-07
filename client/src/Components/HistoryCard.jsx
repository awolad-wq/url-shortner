import React from 'react';
import { Link } from 'react-router-dom';

const HistoryCrad = ({item}) => {
  const shortUrl = `${import.meta.env.VITE_API}/${item.alias}`;
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center">
      <div className="overflow-hidden">
        <p className="font-medium truncate">{item.originalUrl}</p>
        <a href={shortUrl} className="text-blue-600 text-sm">{shortUrl}</a>
      </div>

      <Link
        to={`/stats/${item.alias}`}
        className="text-sm border px-3 py-1.5 rounded-lg hover:bg-slate-100"
      >
        View details
      </Link>
    </div>
  );
};

export default HistoryCrad;