import { Link } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { User } from "../types";
import { useState } from "react";

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Toggle sidebar on mobile
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeSidebar = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button (only visible on small screens) */}
      <button
        className="mobile-menu-btn"
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        ☰
      </button>

      <aside className={`sidebar ${isMobileOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-text">CineVerse</div>
        </div>

        {/* Navigation links */}
        <nav>
          <Link
            to="/"
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
            to="/user/watched"
            className="nav-item"
            activeProps={{ className: "active" }}
            onClick={closeSidebar}
          >
            <span className="nav-icon">✅</span>
            <span className="nav-lbl" data-key="watched">
              Watched
            </span>
            {/* Optional badge: you can fetch count from query */}
            {/* <span className="nav-badge">{watchedCount}</span> */}
          </Link>

          <Link
            to="/user/watchlist"
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
            to="/user/profile"
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
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </aside>

      {/* Optional overlay for mobile */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
    </>
  );
}
