"use client";

import { usePathname, useRouter } from "next/navigation";
import api from "@/utils/axios";
import { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";

export default function ClientLayout({ children }) {
  const { user, setUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = pathname.includes("/tasks");

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  // Ensure user info loads even after login
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null); // No token, no user
        return;
      }

      try {
        const response = await api.get("/me"); // Call backend to get user info
        setUser(response.data); // Use the variable from the try block
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      }
    };

    fetchUser();

    // Optional: listen for login/logout in other tabs
    const handleStorage = () => fetchUser();
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-light bg-light px-4 py-2 d-flex justify-content-between align-items-center shadow-sm">
        {/* Left: Back button if needed */}
        {showBackButton ? (
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push("/projects")}
          >
            ← Back to Projects
          </button>
        ) : (
          <div></div>
        )}

        {/* Center: App title */}
        <span className="navbar-brand mb-0 h1">Task Manager</span>

        {/* Right: User info & logout */}
        {user ? (
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link text-danger d-flex align-items-center gap-1"
              onClick={handleLogout}
              title="Logout"
              style={{ textDecoration: "none", fontWeight: 500 }}
            >
              <i className="bi bi-box-arrow-right fs-5"></i>
              Logout
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </nav>

      <main className="container mt-4">{children}</main>
    </>
  );
}
