import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { publicInstance } from "../api/axios";

export const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const [secBtnHovered, setSecBtnHovered] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      const res = await publicInstance.post("/auth/login", data);
      if (res.data.status) {
        login(res.data.user, res.data.token);
        setSuccess(true);
        setTimeout(() => {
          if (
            res.data.user.role === "admin" ||
            res.data.user.role === "superadmin"
          ) {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(24px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .login-page {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .login-left {
            padding: 40px 32px !important;
          }
          .login-right {
            padding: 40px 24px !important;
          }
        }

        @media (max-width: 480px) {
          .login-left {
            padding: 32px 20px !important;
          }
          .login-logo-main {
            font-size: 32px !important;
            letter-spacing: 4px !important;
          }
          .login-tagline {
            font-size: 14px !important;
            margin-bottom: 24px !important;
          }
          .login-right {
            padding: 32px 18px !important;
          }
          .login-title {
            font-size: 22px !important;
          }
        }
      `}</style>

      <div style={styles.page} className="login-page">
        <div style={styles.left} className="login-left">
          <div style={styles.brand}>
            <div style={styles.logoWrap}>
              <span style={styles.logoMain} className="login-logo-main">
                EMMEY
              </span>
              <span style={styles.logoSub}>TRAVELS</span>
            </div>
            <p style={styles.tagline} className="login-tagline">
              Your world. Your journey. Your way.
            </p>
            <div style={styles.features}>
              {[
                "Flights, buses, cruises and more",
                "Africa to Asia and beyond",
                "Secure and instant booking",
              ].map((f) => (
                <div key={f} style={styles.feature}>
                  <span style={styles.dot}></span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.right} className="login-right">
          <div style={styles.formBox}>
            <h2 style={styles.title} className="login-title">
              Sign in
            </h2>
            <p style={styles.subtitle}>Welcome back. Let's get you moving.</p>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={styles.field}>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#111")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p style={styles.fieldError}>{errors.email.message}</p>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#111")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p style={styles.fieldError}>{errors.password.message}</p>
                )}
              </div>

              <p style={styles.forgot}>
                <span style={styles.link}>Forgot password?</span>
              </p>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.btn,
                  ...(loading ? styles.btnDisabled : {}),
                  ...(btnHovered && !loading ? styles.btnHovered : {}),
                }}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerText}>Don't have an account?</span>
            </div>

            <Link
              to="/register"
              style={{
                ...styles.outlineBtn,
                ...(secBtnHovered ? styles.outlineBtnHovered : {}),
              }}
              onMouseEnter={() => setSecBtnHovered(true)}
              onMouseLeave={() => setSecBtnHovered(false)}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>

      {success && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.popupIcon}>🌍✈️</div>
            <h2 style={styles.popupTitle}>You're logged in, Traveller!</h2>
            <p style={styles.popupText}>
              The world is yours — buckle up and enjoy the ride.
            </p>
            <div style={styles.popupLoader}></div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  left: {
    flex: 1,
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
  },
  brand: { color: "#fff", textAlign: "center" },
  logoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "24px",
  },
  logoMain: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "6px",
    lineHeight: 1,
  },
  logoSub: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#555",
    letterSpacing: "6px",
    marginTop: "4px",
  },
  tagline: {
    fontSize: "16px",
    color: "#888",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  features: { textAlign: "left" },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "10px",
  },
  dot: {
    width: "5px",
    height: "5px",
    background: "#fff",
    borderRadius: "50%",
    flexShrink: 0,
  },
  right: {
    flex: 1,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
  },
  formBox: { width: "100%", maxWidth: "380px" },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "6px",
    letterSpacing: "-0.5px",
  },
  subtitle: { fontSize: "14px", color: "#888", marginBottom: "28px" },
  field: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#111",
    background: "#fff",
    transition: "border-color 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
  fieldError: { color: "#c00", fontSize: "12px", marginTop: "4px" },
  forgot: { textAlign: "right", marginBottom: "16px", fontSize: "13px" },
  link: {
    color: "#111",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.3px",
  },
  btnHovered: {
    background: "#333",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  btnDisabled: { background: "#888", cursor: "not-allowed" },
  error: {
    background: "#fff0f0",
    border: "1px solid #fcc",
    color: "#c00",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
  },
  divider: {
    textAlign: "center",
    margin: "20px 0",
    borderTop: "1px solid #eee",
    position: "relative",
  },
  dividerText: {
    background: "#fff",
    padding: "0 12px",
    color: "#bbb",
    fontSize: "12px",
    position: "relative",
    top: "-9px",
  },
  outlineBtn: {
    display: "block",
    width: "100%",
    padding: "13px",
    background: "#fff",
    color: "#111",
    border: "2px solid #111",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "none",
    boxSizing: "border-box",
    transition: "all 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
  outlineBtnHovered: {
    background: "#111",
    color: "#fff",
    transform: "translateY(-1px)",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(10, 22, 40, 0.88)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    backdropFilter: "blur(6px)",
  },
  popup: {
    background: "#fff",
    borderRadius: "20px",
    padding: "52px 44px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
    animation: "popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  popupIcon: {
    fontSize: "64px",
    marginBottom: "20px",
    display: "block",
    lineHeight: 1,
  },
  popupTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#0a1628",
    marginBottom: "10px",
    letterSpacing: "-0.5px",
  },
  popupText: {
    fontSize: "14px",
    color: "#888",
    lineHeight: "1.7",
    marginBottom: "28px",
  },
  popupLoader: {
    width: "32px",
    height: "32px",
    border: "3px solid #eee",
    borderTop: "3px solid #c9a84c",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 0.8s linear infinite",
  },
};