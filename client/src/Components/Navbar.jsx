import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {


  return (
    <nav className="bg-white shadow-sm ">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">

        {/* Left - Logo */}
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold text-Slate-700">
            Apar's Link Shortener
          </Link>
        </div>
        
        {/* Center - Nav links */}
        <div className="flex gap-6 text-sm font-medium justify-center">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          {/* <Link to="/stats" className="hover:text-blue-400">Statistics</Link> */}
        </div>

        {/* Right - Buttons */}
        <div className="flex-1 flex justify-end gap-4">
          <button className="border px-4 py-1.5 rounded-lg hover:bg-slate-100">
            <Link to="/login">Log in</Link>
          </button>
          <button className="bg-slate-700 shadow-lg shadow-slate-500/60 text-white px-4 py-1.5 rounded-lg hover:bg-slate-900 cursor-pointer">
            Sign up
          </button>
        </div>

      </div>
    </nav>

  );
};

export default Navbar;