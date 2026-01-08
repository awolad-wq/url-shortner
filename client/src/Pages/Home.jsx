import React, { useState } from 'react';
import UrlForm from '../Components/UrlForm';
import UrlResult from '../Components/UrlResult';
import HistoryCard from '../Components/HistoryCard';


const Home = () => {

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );

  const handleNewLink = (data) => {
    // setResult(data);
    // console.log(data);
    const updated = [data, ...history];
    setHistory(updated);
    localStorage.setItem("history", JSON.stringify(updated));
    setResult(data);
  }

  return (
    <div className="max-w-md mx-auto mt-25 mb-10">
      <h1 className="text-4xl font-bold text-center mb-3">
        Apar's Link Shortener
      </h1>
      <p className="text-center text-slate-500 mb-10">
        Create short links, customize them, and track performance.
      </p>

      {/* Long-Url Form */}
      <UrlForm onSuccess={handleNewLink} />


      {/* Will show short-url result */}
      {result && <UrlResult result={result} />}


      {/* History Crad */}
      {history.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-semibold mb-4">Link History</h2>
          <div className="grid gap-4">
            {history.map((item, i) => (
              <HistoryCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>




  );
};

export default Home;