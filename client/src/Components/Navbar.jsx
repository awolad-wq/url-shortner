import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useAxios from "../Hooks/UseAxios";

const Navbar = () => {
  const { user, setUser, loading } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  async function handleLogout() {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch { }
    setUser(null);
    navigate("/login");
  }

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Left - Logo */}
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold text-slate-800">
            Apar's Link Shortener
          </Link>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-end items-center gap-4">

          {loading && (
            <div className="h-9 w-24 rounded-lg bg-slate-200 animate-pulse"></div>
          )}

          {/* NOT LOGGED IN */}
          {!loading && !user && (
            <>
              <Link
                to="/login"
                className="border px-3 md:px-4 py-1.5 rounded-lg hover:bg-slate-100 text-sm"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="bg-slate-700 shadow-lg shadow-slate-500/60 text-white px-3 md:px-4 py-1.5 rounded-lg hover:bg-slate-900 text-sm"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* LOGGED IN */}
          {!loading && user && (
            <div className="relative" ref={menuRef}>
              {/* Avatar */}
              <div
                onClick={() => setOpen(prev => !prev)}
                className="h-9 w-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold cursor-pointer select-none"
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-lg overflow-hidden">

                  {/* User info */}
                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu */}
                  <div className="py-1 text-sm">
                    <MenuItem to="/dashboard" setOpen={setOpen}>
                      Dashboard
                    </MenuItem>

                    <MenuItem to="/dashboard/profile" setOpen={setOpen}>
                      Profile
                    </MenuItem>

                    {user.role === "ADMIN" && (
                      <MenuItem to="/dashboard/admin/links" setOpen={setOpen}>
                        Admin Panel
                      </MenuItem>
                    )}

                    <div className="border-t my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

function MenuItem({ to, children, setOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="block px-4 py-2 hover:bg-slate-100 transition"
    >
      {children}
    </Link>
  );
}

export default Navbar;

