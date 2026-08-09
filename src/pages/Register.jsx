import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { publicInstance } from "../api/axios";

export const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const [secBtnHovered, setSecBtnHovered] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      const res = await publicInstance.post("/auth/register", data);
      if (res.data.status) {
        setSuccess(true);
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

        /* Inline styles below always win over plain CSS, so these
           overrides use !important to take over at smaller breakpoints */
        @media (max-width: 900px) {
          .register-page {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .register-left {
            padding: 40px 32px !important;
          }
          .register-right {
            padding: 40px 24px !important;
          }
        }

        @media (max-width: 480px) {
          .register-left {
            padding: 32px 20px !important;
          }
          .register-logo-main {
            font-size: 32px !important;
            letter-spacing: 4px !important;
          }
          .register-tagline {
            font-size: 14px !important;
            margin-bottom: 24px !important;
          }
          .register-right {
            padding: 32px 18px !important;
          }
          .register-title {
            font-size: 22px !important;
          }
          .register-popup {
            padding: 32px 20px !important;
            width: 92% !important;
          }
        }
      `}</style>
      <div style={styles.page} className="register-page">
        <div style={styles.left} className="register-left">
          <div style={styles.brand}>
            <div style={styles.logoWrap}>
              <span style={styles.logoMain} className="register-logo-main">
                EMMEY
              </span>
              <span style={styles.logoSub}>TRAVELS</span>
            </div>
            <p style={styles.tagline} className="register-tagline">
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

        <div style={styles.right} className="register-right">
          <div style={styles.formBox}>
            <h2 style={styles.title} className="register-title">
              Create your account
            </h2>
            <p style={styles.subtitle}>Join millions exploring the world</p>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={styles.field}>
                <label style={styles.label}>Full name</label>
                <input
                  type="text"
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#111")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p style={styles.fieldError}>{errors.name.message}</p>
                )}
              </div>

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
                <label style={styles.label}>Phone number</label>
                <input
                  type="tel"
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#111")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                  {...register("phone")}
                />
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
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p style={styles.fieldError}>{errors.password.message}</p>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Confirm password</label>
                <input
                  type="password"
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#111")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) =>
                      val === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p style={styles.fieldError}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

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
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p style={styles.terms}>
              By signing up you agree to our{" "}
              <span style={styles.link}>Terms</span> and{" "}
              <span style={styles.link}>Privacy Policy</span>
            </p>

            <div style={styles.divider}>
              <span style={styles.dividerText}>Already have an account?</span>
            </div>

            <Link
              to="/login"
              style={{
                ...styles.outlineBtn,
                ...(secBtnHovered ? styles.outlineBtnHovered : {}),
              }}
              onMouseEnter={() => setSecBtnHovered(true)}
              onMouseLeave={() => setSecBtnHovered(false)}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
      {success && (
        <div style={styles.overlay}>
          <div style={styles.popup} className="register-popup">
            <div style={styles.popupIcon}>👍😉</div>
            <h2 style={styles.popupTitle}>You're almost there, Traveller!</h2>
            <p style={styles.popupText}>
              A verification link has been sent to your email. Click it to
              activate your account and start exploring the world.
            </p>
            <Link to="/login" style={styles.popupBtn}>
              Go to Sign in
            </Link>
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
    overflowY: "auto",
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
    marginTop: "4px",
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
  terms: {
    fontSize: "12px",
    color: "#888",
    marginTop: "14px",
    textAlign: "center",
    lineHeight: "1.6",
  },
  link: {
    color: "#111",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
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
    background: "rgba(10, 22, 40, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    backdropFilter: "blur(4px)",
  },
  popup: {
    background: "#fff",
    borderRadius: "16px",
    padding: "48px 40px",
    maxWidth: "420px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
    animation: "popIn 0.3s ease",
  },
  popupIcon: {
    fontSize: "56px",
    marginBottom: "20px",
    display: "block",
  },
  popupTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#0a1628",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  popupText: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.7",
    marginBottom: "28px",
  },
  popupBtn: {
    display: "inline-block",
    padding: "13px 32px",
    background: "#0a1628",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "14px",
    textDecoration: "none",
    transition: "all 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
};