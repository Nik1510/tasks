"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function NavbarProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get token from cookies/localStorage (depending on your setup)
        const token = localStorage.getItem("token");

        const res = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full border border-primary">
          <Image
            src={
              user?.profilePic ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email || "guest"}`
            }
            alt={user?.username || "User Avatar"}
            width={40}
            height={40}
          />
        </div>
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1000] mt-3 w-56 p-3 shadow-lg border border-base-300"
      >
        <li>
          <div>
            <p className="font-semibold text-sm">{user?.username}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </li>

        <div className="divider my-1"></div>

        <li>
          <span
            className={`badge ${
              user?.isVerified ? "badge-success" : "badge-warning"
            } text-xs`}
          >
            {user?.isVerified ? "Email Verified" : "Not Verified"}
          </span>
        </li>

        <li>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="btn btn-sm btn-error text-white w-full mt-2"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
