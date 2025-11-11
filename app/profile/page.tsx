"use client";
import React, { useEffect, useState } from "react";
import { Shield, CheckCircle, XCircle, LogOut } from "lucide-react";

interface UserProfile {
  username: string;
  email: string;
  isVerified: boolean;
}

export default function ProfileDropdown() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/profile", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="skeleton w-12 h-12 rounded-full"></div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64"
      >
        <li>
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-lg font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="font-bold">{user?.username}</p>
              <p className="text-sm opacity-70">{user?.email}</p>
            </div>
          </div>
        </li>

        <div className="divider my-2"></div>

        <li>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>
              {user?.isVerified ? (
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle className="w-4 h-4" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-warning">
                  <XCircle className="w-4 h-4" /> Not Verified
                </span>
              )}
            </span>
          </div>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-error"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
