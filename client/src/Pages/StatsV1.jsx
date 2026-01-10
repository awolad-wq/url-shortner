import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../Hooks/UseAxios';

const StatsV1 = () => {

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const { alias } = useParams();
  const axios = useAxios();

  useEffect(() => {
    const loadData = async () => {

      try {
        axios.get(`${import.meta.env.VITE_API}/stats/${alias}`).then((res) => {
          setData(res.data.data);
        }
        );
      }
      catch {
        setData(null);
        setError("Failed to fetch data.");
      }
      finally {
        setLoading(false);
      }
    }

    loadData();
  }, [alias]);

  

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!data) return <p className="text-center mt-20">No data found.</p>;


  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold mb-6">Link Analytics</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-6 space-y-1">
        <p><b>Alias:</b> {data.alias}</p>
        <p><b>Original URL:</b> {data.originalUrl}</p>
        <p><b>Total Clicks:</b> {data.analytics.totalClicks}</p>
        <p><b>Last 7 days:</b> {data.analytics.clicksLast7Days}</p>
        <p><b>Last 30 days:</b> {data.analytics.clicksLast30Days}</p>
        <p><b>Status:</b> {data.isActive ? "Active" : "Inactive"}</p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="font-semibold mb-3">Clicks by day</h2>
        {Object.entries(data.analytics.clicksByDay).map(([day, count]) => (
          <div key={day} className="flex justify-between py-1 text-sm">
            <span>{day}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsV1;