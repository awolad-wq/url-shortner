import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-center px-6">

      {/* Background Glowing Blobs (Consistent with your homepage) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="relative text-center">
        {/* Large Error Code */}
        <h1 className="text-9xl font-black text-slate-200 selection:bg-orange-200">
          404
        </h1>

        {/* Messaging */}
        <div className="-mt-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Link Lost in Space
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            The short link you followed might have expired, been deleted, or contains a typo. Double-check the URL and try again.
          </p>

          {/* Action Button */}
          <Link
            to={"/"}
            className="inline-block px-8 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-200"
          >
            Back to Home
          </Link>
        </div>

        {/* Small Utility Links */}
        <div className="mt-12 flex justify-center gap-6 text-sm text-slate-400 font-medium">
          <span>&bull;</span>
          <Link to="https://asgshop.ai" className="hover:text-slate-600">ASG SHOP</Link>
          <span>&bull;</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;