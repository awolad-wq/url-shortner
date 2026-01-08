import React from 'react';

const StatCard = ({ label, value }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;