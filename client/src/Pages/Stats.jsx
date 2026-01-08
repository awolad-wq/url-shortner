import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../Hooks/UseAxios';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts";
import StatCard from '../Components/StatCard';

const Stats = () => {
  const [data, setData] = React.useState(null);
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const { alias } = useParams();
  const axios = useAxios();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(`/stats/${alias}`);
        const apiData = res.data.data;
        setData(apiData);

        // Line chart data collection
        const formatted = Object.entries(apiData.analytics.clicksByDay).map(
          ([date, clicks]) => ({
            date,
            clicks
          })
        );

        setChartData(formatted);

      } catch (err) {
        setError("Failed to fetch data.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [alias]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!data) return <p className="text-center mt-20">No data found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold mb-8">Link Analytics</h1>

      {/* INFO CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Clicks" value={data.analytics.totalClicks} />
        <StatCard label="Last 7 Days" value={data.analytics.clicksLast7Days} />
        <StatCard label="Last 30 Days" value={data.analytics.clicksLast30Days} />
        <StatCard label="Status" value={data.isActive ? "Active" : "Inactive"} />
      </div>

      {/* LINE CHART */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
        <h2 className="font-semibold mb-4">Clicks Over Time</h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;
