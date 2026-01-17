import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAxios from '../Hooks/UseAxios';
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      }, { withCredentials: true });

      if (!res.data.success) throw new Error("Registration failed");

      //Auto Login after successful registration
      await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      }, { withCredentials: true });

      // load profile
      const profile = await axios.get("/auth/profile", { withCredentials: true });
      setUser(profile.data.data);

      navigate("/dashboard");

      

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="text-slate-500 mt-1">
            Start shortening and tracking your links
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />

          <PasswordInput label="Password" name="password" value={form.password} onChange={handleChange} show={showPass} toggle={() => setShowPass(!showPass)} />
          <PasswordInput label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-900 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

/* ---------------- small components ---------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} required className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none" />
    </div>
  );
}

function PasswordInput({ label, show, toggle, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          required
          className="w-full border rounded-xl px-3 py-2 pr-10 focus:ring-2 focus:ring-slate-900 outline-none"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default Register;
