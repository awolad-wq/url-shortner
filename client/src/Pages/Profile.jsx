import { useEffect, useState } from "react";
import useAxios from "../Hooks/UseAxios";


export default function Profile() {
  const axios = useAxios();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const res = await axios.get("/auth/profile", {
        withCredentials: true,
      });

      if (!res.data.success) throw new Error("Failed to load profile");

      setUser(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-slate-500">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-slate-500 text-sm">
          Manage your account information
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-6">

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm">

          <Info label="User ID" value={user.id} />
          <Info label="Role" value={user.role} />

          {/* <Info
            label="Account status"
            value={user.isVerified ? "Verified" : "Not verified"}
            badge
            success={user.isVerified}
          /> */}

          {/* <Info
            label="Joined"
            value={new Date(user.createdAt).toLocaleDateString()}
          /> */}

        </div>

        {/* Divider */}
        <div className="border-t pt-5 flex justify-end">
          <button
            disabled
            className="px-4 py-2 rounded-lg border text-sm text-slate-400 cursor-not-allowed"
          >
            Edit profile (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, badge, success }) {
  if (badge) {
    return (
      <div className="bg-slate-50 border rounded-xl p-4">
        <p className="text-slate-500 text-xs">{label}</p>
        <span
          className={`inline-block mt-1 px-2 py-1 text-xs rounded-md ${
            success
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border rounded-xl p-4">
      <p className="text-slate-500 text-xs">{label}</p>
      <p className="font-medium mt-1 break-all">{value}</p>
    </div>
  );
}
