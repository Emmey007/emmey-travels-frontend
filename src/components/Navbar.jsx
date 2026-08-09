import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { privateInstance } from "../api/axios";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // Close the mobile menu automatically whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await privateInstance.get("/notification");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.log("Could not fetch notifications");
    }
  };

  const markRead = async () => {
    try {
      await privateInstance.put("/notification/mark-read");
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.log("Could not mark notifications as read");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Flights", path: "/flights" },
    { label: "Bus", path: "/bus" },
    { label: "Ship Cruise", path: "/ship-cruise" },
    { label: "Boat Cruise", path: "/boat-cruise" },
  ];

  const isDashboard = location.pathname.startsWith("/dashboard");

  // On admin dashboard routes, the dashboard has its own sidebar/topbar —
  // the full public navbar (logo, nav links, hamburger) shouldn't render
  // there. Only the notification bell carries over.
  if (isDashboard) {
    return (
      <div style={styles.dashboardBar}>
        <div style={styles.bellWrap}>
          <button
            style={styles.bell}
            onClick={() => {
              setShowNotifications(!showNotifications);
              markRead();
            }}
          >
            🔔
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div style={styles.dropdown}>
              <p style={styles.dropdownTitle}>Notifications</p>
              {notifications.length === 0 && (
                <p style={styles.dropdownEmpty}>No notifications yet</p>
              )}
              {notifications.map((n) => (
                <div
                  key={n._id}
                  style={{
                    ...styles.notifItem,
                    ...(n.isRead ? {} : styles.notifUnread),
                  }}
                >
                  <p style={styles.notifMsg}>{n.message}</p>
                  <p style={styles.notifTime}>
                    {new Date(n.createdAt).toDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <nav style={styles.nav} className="navbar-root">
      {/* Inline styles above always win over plain CSS, so these
          overrides use !important to take over at smaller breakpoints */}
      <style>{`
        .navbar-toggle {
          display: none !important;
        }

        @media (max-width: 900px) {
          .navbar-root {
            padding: 0 20px !important;
          }
          .navbar-toggle {
            display: flex !important;
          }
          .navbar-links {
            display: none !important;
          }
          .navbar-actions {
            display: none !important;
          }
          .navbar-mobile-menu {
            display: flex !important;
          }
        }

        @media (min-width: 901px) {
          .navbar-mobile-menu {
            display: none !important;
          }
        }

        /* Animated hamburger — three bars that morph into an X */
        .hamburger-bar {
          width: 22px;
          height: 2.5px;
          background: #0A2540;
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.2s ease;
          transform-origin: center;
        }
        .hamburger-bar.bar1.open {
          transform: translateY(7.5px) rotate(45deg);
        }
        .hamburger-bar.bar2.open {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger-bar.bar3.open {
          transform: translateY(-7.5px) rotate(-45deg);
        }

        /* Mobile menu slide-down + fade-in on open */
        @keyframes navMobileMenuIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .navbar-mobile-menu {
          animation: navMobileMenuIn 0.45s ease;
        }
      `}</style>

      <Link to="/" style={styles.logo}>
        <span style={styles.logoMain}>EMMEY</span>
        <span style={styles.logoSub}>TRAVELS</span>
      </Link>

      <div style={styles.links} className="navbar-links">
        {navLinks.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navLink,
              ...(location.pathname === item.path ? styles.navLinkActive : {}),
              ...(hovered === item.path ? styles.navLinkHovered : {}),
            }}
            onMouseEnter={() => setHovered(item.path)}
            onMouseLeave={() => setHovered(null)}
          >
            {item.label}

            <span
              style={{
                position: "absolute",
                left: "10%",
                bottom: "-5px",
                width:
                  location.pathname === item.path || hovered === item.path
                    ? "80%"
                    : "0%",
                height: "3px",
                background: "#D4AF37",
                borderRadius: "20px",
                transition: "width .3s ease",
              }}
            />
          </Link>
        ))}
      </div>

      <div style={styles.actions} className="navbar-actions">
        {user && (
          <>
            <div style={styles.bellWrap}>
              <button
                style={styles.bell}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  markRead();
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={styles.badge}>{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div style={styles.dropdown}>
                  <p style={styles.dropdownTitle}>Notifications</p>
                  {notifications.length === 0 && (
                    <p style={styles.dropdownEmpty}>No notifications yet</p>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      style={{
                        ...styles.notifItem,
                        ...(n.isRead ? {} : styles.notifUnread),
                      }}
                    >
                      <p style={styles.notifMsg}>{n.message}</p>
                      <p style={styles.notifTime}>
                        {new Date(n.createdAt).toDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(user.role === "admin" || user.role === "superadmin") && (
              <Link to="/dashboard" style={styles.ghostLink}>
                Dashboard
              </Link>
            )}
          </>
        )}
        {user ? (
          <>
            <Link to="/wishlist" style={styles.ghostLink}>
              Wishlist
            </Link>
            <Link to="/bookings" style={styles.ghostLink}>
              My Bookings
            </Link>
            {(user.role === "admin" || user.role === "superadmin") && (
              <Link to="/dashboard" style={styles.ghostLink}>
                Dashboard
              </Link>
            )}
            <button
              style={{
                ...styles.outlineBtn,
                ...(hovered === "logout" ? styles.outlineBtnHovered : {}),
              }}
              onMouseEnter={() => setHovered("logout")}
              onMouseLeave={() => setHovered(null)}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              ...styles.outlineBtn,
              ...(hovered === "login" ? styles.outlineBtnHovered : {}),
            }}
            onMouseEnter={() => setHovered("login")}
            onMouseLeave={() => setHovered(null)}
          >
            Sign in
          </Link>
        )}
      </div>

      {/* Hamburger toggle — only visible under 900px via CSS above */}
      <button
        className="navbar-toggle"
        style={styles.toggleBtn}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-bar bar1 ${menuOpen ? "open" : ""}`} />
        <span className={`hamburger-bar bar2 ${menuOpen ? "open" : ""}`} />
        <span className={`hamburger-bar bar3 ${menuOpen ? "open" : ""}`} />
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={styles.mobileMenu} className="navbar-mobile-menu">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.mobileNavLink,
                ...(location.pathname === item.path
                  ? styles.mobileNavLinkActive
                  : {}),
              }}
            >
              {item.label}
            </Link>
          ))}

          <div style={styles.mobileDivider} />

          {user ? (
            <>
              <Link to="/wishlist" style={styles.mobileNavLink}>
                Wishlist
              </Link>
              <Link to="/bookings" style={styles.mobileNavLink}>
                My Bookings
              </Link>
              {(user.role === "admin" || user.role === "superadmin") && (
                <Link to="/dashboard" style={styles.mobileNavLink}>
                  Dashboard
                </Link>
              )}
              <button style={styles.mobileLogoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.mobileSignInBtn}>
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 70px",
    height: "82px",

    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    borderBottom: "1px solid rgba(0,0,0,0.06)",

    position: "sticky",
    top: 0,
    zIndex: 999,

    boxShadow: "0 8px 35px rgba(0,0,0,.05)",

    fontFamily: "'Inter', sans-serif",
  },

  logo: {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
  },

  logoMain: {
    fontSize: "26px",
    fontWeight: "900",
    color: "#0A2540",
    letterSpacing: "3px",
  },

  logoSub: {
    marginTop: "3px",
    color: "#D4AF37",
    fontSize: "11px",
    letterSpacing: "6px",
    fontWeight: "700",
  },

  links: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },

  navLink: {
    position: "relative",
    color: "#444",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    padding: "10px 14px",
    transition: ".3s",
    borderRadius: "8px",
  },

  navLinkHovered: {
    color: "#0A2540",
    background: "#F4F7FA",
    transform: "translateY(-2px)",
  },

  navLinkActive: {
    color: "#0A2540",
    fontWeight: "700",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  ghostLink: {
    color: "#555",
    textDecoration: "none",
    fontWeight: "600",
    transition: ".3s",
  },

  outlineBtn: {
    border: "2px solid #0A2540",
    background: "transparent",
    color: "#0A2540",

    padding: "12px 22px",

    borderRadius: "40px",

    cursor: "pointer",

    fontWeight: "700",

    transition: ".3s",

    textDecoration: "none",
  },

  outlineBtnHovered: {
    background: "#0A2540",
    color: "#fff",
    transform: "translateY(-2px)",
  },

  solidBtn: {
    background: "linear-gradient(135deg,#0A2540,#1E4D8C)",

    color: "#fff",

    padding: "13px 24px",

    borderRadius: "40px",

    fontWeight: "700",

    textDecoration: "none",

    boxShadow: "0 15px 35px rgba(10,37,64,.25)",

    transition: ".35s",

    border: "none",

    cursor: "pointer",
  },

  solidBtnHovered: {
    transform: "translateY(-3px)",
    boxShadow: "0 20px 45px rgba(10,37,64,.35)",
  },
  bellWrap: { position: "relative" },
  bell: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    position: "relative",
    padding: "6px",
  },
  badge: {
    position: "absolute",
    top: "0",
    right: "0",
    background: "#c00",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    top: "40px",
    right: "0",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    width: "300px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    zIndex: 200,
    overflow: "hidden",
  },
  dropdownTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#111",
    padding: "14px 16px",
    borderBottom: "1px solid #eee",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  dropdownEmpty: {
    fontSize: "13px",
    color: "#888",
    padding: "20px 16px",
    textAlign: "center",
  },
  notifItem: {
    padding: "12px 16px",
    borderBottom: "1px solid #f5f5f5",
    cursor: "pointer",
  },
  notifUnread: { background: "#f8f6f0" },
  notifMsg: {
    fontSize: "13px",
    color: "#111",
    marginBottom: "4px",
    lineHeight: "1.5",
  },
  notifTime: { fontSize: "11px", color: "#888" },

  // --- Dashboard-only bar (just the notification bell) ---
  dashboardBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 24px",
    height: "64px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 999,
  },

  // --- Mobile menu styles ---
  toggleBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    width: "36px",
    height: "36px",
  },
  mobileMenu: {
    position: "absolute",
    top: "82px",
    left: 0,
    right: 0,
    background: "#fff",
    borderBottom: "1px solid #eee",
    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
    flexDirection: "column",
    padding: "16px 20px 24px",
    gap: "6px",
    zIndex: 998,
  },
  mobileNavLink: {
    color: "#333",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    padding: "12px 8px",
    borderRadius: "8px",
  },
  mobileNavLinkActive: {
    color: "#0A2540",
    background: "#F4F7FA",
  },
  mobileDivider: {
    height: "1px",
    background: "#eee",
    margin: "8px 0",
  },
  mobileLogoutBtn: {
    marginTop: "8px",
    border: "2px solid #0A2540",
    background: "transparent",
    color: "#0A2540",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
  },
  mobileSignInBtn: {
    marginTop: "8px",
    display: "block",
    textAlign: "center",
    border: "2px solid #0A2540",
    color: "#0A2540",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "700",
    textDecoration: "none",
  },
};