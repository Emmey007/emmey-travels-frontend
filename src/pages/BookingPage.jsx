import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { privateInstance } from "../api/axios";

const occasions = [
  "Vacation",
  "Honeymoon",
  "Business Travel",
  "Family Trip",
  "Solo Adventure",
  "Group Tour",
  "Anniversary",
  "Educational Trip",
  "Medical Trip",
  "Other",
];

const currencies = ["NGN", "USD", "EUR", "GBP"];
const exchangeRates = { NGN: 1, USD: 0.00065, EUR: 0.0006, GBP: 0.00051 };
const symbols = { NGN: "₦", USD: "$", EUR: "€", GBP: "£" };

const generatePassportNumber = (existingNumbers = []) => {
  let number;
  do {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    number = `A${randomDigits}`;
  } while (existingNumbers.includes(number));
  return number;
};

export const BookingPage = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Falls back to sessionStorage on reload, since location.state doesn't
  // survive a full page reload and would otherwise kick the user out
  const [destination] = useState(() => {
    if (state?.destination) {
      sessionStorage.setItem(
        "bookingDestination",
        JSON.stringify(state.destination),
      );
      return state.destination;
    }
    const saved = sessionStorage.getItem("bookingDestination");
    return saved ? JSON.parse(saved) : null;
  });

  // Restore typed form data (seats, occasion, currency, passengers) so a
  // reload doesn't wipe out what the user already filled in
  const savedForm = (() => {
    try {
      const saved = sessionStorage.getItem("bookingFormData");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const [seats, setSeats] = useState(savedForm?.seats || 1);
  const [occasion, setOccasion] = useState(savedForm?.occasion || "");
  const [currency, setCurrency] = useState(savedForm?.currency || "NGN");
  const [passengers, setPassengers] = useState(
    savedForm?.passengers || [
      { name: "", passportNumber: "", dateOfBirth: "" },
    ],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!destination) navigate("/");
  }, [destination, navigate]);

  useEffect(() => {
    setPassengers((prev) =>
      Array.from(
        { length: seats },
        (_, i) => prev[i] || { name: "", passportNumber: "", dateOfBirth: "" },
      ),
    );
  }, [seats]);

  // Persist form data on every change so a reload can restore it
  useEffect(() => {
    sessionStorage.setItem(
      "bookingFormData",
      JSON.stringify({ seats, occasion, currency, passengers }),
    );
  }, [seats, occasion, currency, passengers]);

  const convertPrice = (priceNGN) => {
    const rate = exchangeRates[currency];
    const converted = priceNGN * rate;
    return `${symbols[currency]}${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const totalPrice = destination?.price * seats;

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Every passenger gets their own generate button; numbers are checked
  // against the other passengers already filled in on this booking so
  // two people on the same trip never end up with the same number
  const handleGeneratePassport = (index) => {
    const existingNumbers = passengers
      .map((p) => p.passportNumber)
      .filter(Boolean);
    const newNumber = generatePassportNumber(existingNumbers);
    handlePassengerChange(index, "passportNumber", newNumber);
  };

  const handleSubmit = async () => {
    if (!user) return navigate("/login");
    if (!occasion) return setError("Please select an occasion");

    const emptyPassenger = passengers.find((p) => !p.name);
    if (emptyPassenger) return setError("Please fill in all passenger names");

    try {
      setLoading(true);
      setError("");

      const bookingData = {
        listing: /^[a-f\d]{24}$/i.test(destination._id) ? destination._id : null,
        seats,
        occasion,
        passengers,
        totalPrice,
        currency: destination.currency || "NGN",
      };

      const res = await privateInstance.post("/booking", bookingData);

      if (res.data.status) {
        sessionStorage.removeItem("bookingDestination");
        sessionStorage.removeItem("bookingFormData");
        setSuccess(true);
      } else {
        setError(res.data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!destination) return null;

  return (
    <div style={styles.page}>
      {/* Responsive overrides — inline styles above win over plain CSS,
          so these use !important to take over at smaller breakpoints */}
      <style>{`
        @media (max-width: 900px) {
          .booking-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .booking-container {
            padding: 32px 20px !important;
          }
          .booking-hero {
            height: 320px !important;
          }
          .booking-hero-overlay {
            padding: 28px 24px !important;
          }
          .booking-hero-title {
            font-size: 28px !important;
          }
        }

        @media (max-width: 480px) {
          .booking-hero {
            height: 220px !important;
          }
          .booking-hero-overlay {
            padding: 20px 18px !important;
          }
          .booking-hero-title {
            font-size: 21px !important;
          }
          .booking-hero-sub {
            font-size: 13px !important;
          }
          .booking-container {
            padding: 24px 14px !important;
          }
          .booking-card {
            padding: 16px !important;
          }
          .passport-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .passport-row button {
            width: 100% !important;
            padding: 10px !important;
          }
          .booking-popup {
            padding: 32px 20px !important;
            width: 92% !important;
          }
          .booking-total-value {
            font-size: 20px !important;
          }
        }
      `}</style>

      {success && (
        <div style={styles.overlay}>
          <div style={styles.popup} className="booking-popup">
            <div style={styles.popupIcon}>🎉</div>
            <h2 style={styles.popupTitle}>Booking Confirmed!</h2>
            <p style={styles.popupText}>
              Your booking is successful traveller 😉👍 Check your email for
              confirmation.
            </p>
            <button
              style={styles.popupBtn}
              onClick={() => navigate("/bookings")}
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}

      <div style={styles.hero} className="booking-hero">
        <img
          src={destination.image}
          alt={destination.name}
          style={styles.heroImg}
        />
        <div style={styles.heroOverlay} className="booking-hero-overlay">
          <span style={styles.typeBadge}>{destination.type}</span>
          <h1 style={styles.heroTitle} className="booking-hero-title">
            {destination.name}
          </h1>
          <p style={styles.heroSub} className="booking-hero-sub">
            {destination.country} · {destination.continent}
          </p>
        </div>
      </div>

      <div style={styles.container} className="booking-container">
        <div style={styles.grid} className="booking-grid">
          <div style={styles.details}>
            <h2 style={styles.sectionTitle}>Trip Details</h2>
            <div style={styles.detailCard} className="booking-card">
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Price per seat</span>
                <div style={styles.priceRow}>
                  <span style={styles.detailValue}>
                    ₦{destination.price?.toLocaleString()}
                  </span>
                  <select
                    style={styles.currencySelect}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <p style={styles.converted}>
                  ≈ {convertPrice(destination.price)}
                </p>
              </div>

              {destination.departureDate && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Departure Date</span>
                  <span style={styles.detailValue}>
                    {new Date(destination.departureDate).toDateString()}
                  </span>
                </div>
              )}

              {destination.duration && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Duration</span>
                  <span style={styles.detailValue}>
                    {destination.duration}
                  </span>
                </div>
              )}

              {destination.seatsAvailable && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Seats Available</span>
                  <span style={styles.detailValue}>
                    {destination.seatsAvailable}
                  </span>
                </div>
              )}

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Description</span>
                <p style={styles.description}>{destination.description}</p>
              </div>
            </div>
          </div>

          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>Book Your Trip</h2>
            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.formCard} className="booking-card">
              <div style={styles.field}>
                <label style={styles.label}>Number of Seats</label>
                <div style={styles.seatsRow}>
                  <button
                    style={styles.seatsBtn}
                    onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  >
                    −
                  </button>
                  <span style={styles.seatsCount}>{seats}</span>
                  <button
                    style={styles.seatsBtn}
                    onClick={() =>
                      setSeats((s) =>
                        Math.min(destination.seatsAvailable || 10, s + 1),
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Occasion</label>
                <select
                  style={styles.select}
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                >
                  <option value="">Select occasion</option>
                  {occasions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Passenger Details</label>
                {passengers.map((p, i) => (
                  <div key={i} style={styles.passengerCard}>
                    <p style={styles.passengerTitle}>
                      Passenger {i + 1} {i === 0 && "(You)"}
                    </p>
                    <input
                      style={styles.input}
                      placeholder="Full name"
                      value={p.name}
                      onChange={(e) =>
                        handlePassengerChange(i, "name", e.target.value)
                      }
                    />
                    <div style={styles.passportRow} className="passport-row">
                      <input
                        style={styles.passportInput}
                        placeholder="Passport number"
                        value={p.passportNumber}
                        onChange={(e) =>
                          handlePassengerChange(
                            i,
                            "passportNumber",
                            e.target.value,
                          )
                        }
                      />
                      <button
                        type="button"
                        style={styles.generateBtn}
                        onClick={() => handleGeneratePassport(i)}
                      >
                        Generate
                      </button>
                    </div>
                    <input
                      style={styles.input}
                      type="date"
                      value={p.dateOfBirth}
                      onChange={(e) =>
                        handlePassengerChange(i, "dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              <div style={styles.totalBox}>
                <span style={styles.totalLabel}>Total Price</span>
                <span style={styles.totalValue} className="booking-total-value">
                  ₦{totalPrice?.toLocaleString()}
                </span>
                <span style={styles.totalConverted}>
                  ≈ {convertPrice(totalPrice)}
                </span>
              </div>

              <button
                style={styles.bookBtn}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>

              {!user && (
                <p style={styles.loginNote}>
                  You need to{" "}
                  <a href="/login" style={styles.loginLink}>
                    sign in
                  </a>{" "}
                  to book a trip.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  hero: { position: "relative", height: "420px", overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(10,22,40,0.9), transparent)",
    padding: "40px 48px",
  },
  typeBadge: {
    background: "#c9a84c",
    color: "#0a1628",
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
    textTransform: "capitalize",
    display: "inline-block",
    marginBottom: "10px",
  },
  heroTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "6px",
    letterSpacing: "-0.5px",
  },
  heroSub: { fontSize: "16px", color: "#8899bb" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "16px",
    letterSpacing: "-0.3px",
  },
  detailCard: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  detailRow: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f5f5f5",
  },
  detailLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  },
  detailValue: { fontSize: "16px", fontWeight: "700", color: "#111" },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "4px",
  },
  converted: { fontSize: "13px", color: "#888", marginTop: "4px" },
  currencySelect: {
    padding: "4px 8px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.7",
    marginTop: "4px",
  },
  formCard: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  field: { marginBottom: "20px" },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "8px",
    fontFamily: "'Inter', sans-serif",
  },
  select: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    cursor: "pointer",
  },
  seatsRow: { display: "flex", alignItems: "center", gap: "16px" },
  seatsBtn: {
    width: "36px",
    height: "36px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  seatsCount: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#111",
    minWidth: "32px",
    textAlign: "center",
  },
  passengerCard: {
    background: "#f9f9f9",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
  },
  passengerTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  passportRow: {
    display: "flex",
    gap: "8px",
    alignItems: "stretch",
    marginBottom: "8px",
  },
  passportInput: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    marginBottom: 0,
  },
  generateBtn: {
    padding: "0 16px",
    background: "#0a1628",
    color: "#c9a84c",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s",
  },
  totalBox: {
    background: "#0a1628",
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  totalLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#8899bb",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  totalValue: { fontSize: "24px", fontWeight: "800", color: "#fff" },
  totalConverted: { fontSize: "13px", color: "#c9a84c" },
  bookBtn: {
    width: "100%",
    padding: "14px",
    background: "#c9a84c",
    color: "#0a1628",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.3px",
  },
  loginNote: {
    fontSize: "13px",
    color: "#888",
    textAlign: "center",
    marginTop: "12px",
  },
  loginLink: { color: "#0a1628", fontWeight: "700" },
  error: {
    background: "#fff0f0",
    border: "1px solid #fcc",
    color: "#c00",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  details: {},
  form: {},
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(10,22,40,0.85)",
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
  },
  popupIcon: { fontSize: "56px", marginBottom: "16px" },
  popupTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#0a1628",
    marginBottom: "12px",
  },
  popupText: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.7",
    marginBottom: "28px",
  },
  popupBtn: {
    padding: "13px 32px",
    background: "#0a1628",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
};