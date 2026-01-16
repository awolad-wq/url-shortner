import { Link } from "react-router-dom";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import useAxios from '../Hooks/UseAxios';

const Register = () => {
  const axios = useAxios();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => { 
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
      const res = await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (res.data.success) {
        // Handle successful login (e.g., redirect, show message)
        console.log("Registration successful");
      } else {
        console.log("Registration failed. Please try again.");
      }
    }
    catch(err){
      if (!err.response) {
        console.log("Network Error. Server is not running");
      } else {
        console.log(err.response.data?.error || "Registration failed");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="text-slate-500 mt-1">
            Start shortening and tracking your links
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition shadow-lg cursor-pointer"
          >
            Create account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Social buttons (UI only) */}
        <div className="grid grid-cols-2 gap-3">
          <button className="border cursor-pointer rounded-xl py-2 text-sm hover:bg-slate-100">
            <FcGoogle className="inline-block size-6" />
          </button>
          <button className="border cursor-pointer rounded-xl py-2 text-sm hover:bg-slate-100">
            <FaGithub className="inline-block size-6" /> 
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-900 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
