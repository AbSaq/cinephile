import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "../features/auth/hooks/useAuth.tsx";
import type { User } from "../types";
import { useState } from "react";

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeSidebar = () => setIsMobileOpen(false);

  const handleLogout = async () => {
    try {
      closeSidebar();
      await logout();

      await router.invalidate();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout transition failed:", error);
    }
  };

  return (
    <>
      {/* Mobile hamburger button (only visible on small screens) */}
      <button
        className="mobile-menu-btn"
        onClick={toggleSidebar}
        aria-label="Menu"
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          zIndex: 110,
          background: "var(--bg3)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      <aside className={`sidebar ${isMobileOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-text">CineVerse</div>
        </div>

        {/* Navigation links */}
        <nav style={{ display: "flex", flexDirection: "column" }}>
          <Link
            to="/home"
            className="nav-item"
            activeProps={{ className: "active" }}
            onClick={closeSidebar}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-lbl" data-key="home">
              Home
            </span>
          </Link>

          <Link
            to="/watched"
            className="nav-item"
            activeProps={{ className: "active" }}
            onClick={closeSidebar}
          >
            <span className="nav-icon">✅</span>
            <span className="nav-lbl" data-key="watched">
              Watched
            </span>
          </Link>

          <Link
            to="/watchlist"
            className="nav-item"
            activeProps={{ className: "active" }}
            onClick={closeSidebar}
          >
            <span className="nav-icon">🔖</span>
            <span className="nav-lbl" data-key="watchlist">
              Watchlist
            </span>
          </Link>

          <Link
            to="/profile"
            className="nav-item"
            activeProps={{ className: "active" }}
            onClick={closeSidebar}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-lbl" data-key="profile">
              Profile
            </span>
          </Link>
        </nav>

        {/* Bottom section with user info & logout */}
        <div className="sidebar-bottom">
          <div className="user-info" onClick={closeSidebar}>
            {/* Safe check fallback logic string indexing prevention in case name data is slow to hydrate */}
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="user-name">{user?.name || "User"}</div>
              <div className="user-email">{user?.email || ""}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99,
          }}
        />
      )}
    </>
  );
}
