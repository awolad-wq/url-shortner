function StatCard({ title, value }) {
  return (
    <div className="bg-white  rounded-2xl shadow-md p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export default StatCard;