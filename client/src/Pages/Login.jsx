import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAxios from "../Hooks/UseAxios";

export default function Login() {
  const axios = useAxios();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Check if response indicates success
      if (res.data.success) {
        // Store user in localStorage (UI purpose only)
        localStorage.setItem("user", JSON.stringify(res.data.data.user));


        // // Store user in localStorage
        // localStorage.setItem("user", JSON.stringify(res.data.data.user));

        // // Check cookies
        // console.log("All cookies:", document.cookie);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        // Handle unsuccessful response
        throw new Error(res.data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-1">
            Log in to manage and track your links
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-slate-900 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}