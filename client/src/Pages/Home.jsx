import React, { useState } from 'react';
import UrlForm from '../Components/UrlForm';
import UrlResult from '../Components/UrlResult';
import HistoryCard from '../Components/HistoryCard';


const Home = () => {

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [activeTab, setActiveTab] = useState("short");

  const handleNewLink = (data) => {
    // setResult(data);
    // console.log(data);
    const updated = [data, ...history];
    setHistory(updated);
    localStorage.setItem("history", JSON.stringify(updated));
    setResult(data);
  }

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("history");
  }

  return (
    <div className="max-w-md mx-auto mt-25 mb-10">
      <h1 className="text-4xl font-bold text-center mb-3">
        Apar's Link Shortener
      </h1>
      <p className="text-center text-slate-500 mb-10">
        Create short links, customize them, and track performance.
      </p>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setActiveTab("short")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition
              ${activeTab === "short"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500 hover:text-slate-900"
              }`}
          >
            Short URL
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition
              ${activeTab === "history"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500 hover:text-slate-900"
              }`}
          >
            History {history.length > 0 && `(${history.length})`}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "short" && (
        <div className="max-w-xl mx-auto">
          <UrlForm onSuccess={handleNewLink} />
          {result && <UrlResult result={result} />}
        </div>
      )}

      {activeTab === "history" && (
        <div className="mt-6 max-w-3xl mx-auto">
          {
            history.length > 0 && (
              <div className="flex justify-between mb-4 items-center">
                <h2 className="text-xl font-semibold">Link History</h2>
                <button
                  onClick={handleClearHistory}
                  className="text-sm text-red-500 cursor-pointer"
                >
                  Clear History
                </button>
              </div>
            )
          }
          {history.length === 0 ? (
            <p className="text-center text-slate-500">
              No links created yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {history.map((item, i) => (
                <HistoryCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
      {/* Long-Url Form */}
      {/* // <UrlForm onSuccess={handleNewLink} /> */}


      {/* Will show short-url result */}
      {/* {result && <UrlResult result={result} />} */}


      {/* History Crad */}
      {/* {history.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-semibold mb-4">Link History</h2>
          <div className="grid gap-4">
            {history.map((item, i) => (
              <HistoryCard key={i} item={item} />
            ))}
          </div>
        </div>
      )} */}
    </div>




  );
};

export default Home;