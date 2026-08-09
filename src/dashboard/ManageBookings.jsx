import { useState, useEffect } from "react";
import { privateInstance } from "../api/axios";

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await privateInstance.get("/booking");
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await privateInstance.put(`/booking/${id}`, { status });
      setBookings(bookings.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update booking");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await privateInstance.delete(`/booking/${id}`);
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div>
      <h1 style={styles.title}>Manage Bookings</h1>
      <p style={styles.count}>{bookings.length} bookings total</p>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Reference</span>
          <span>User</span>
          <span>Route</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {bookings.length === 0 && <p style={styles.empty}>No bookings yet</p>}
        {bookings.map((booking) => (
          <div key={booking._id} style={styles.tableRow}>
            <span style={styles.ref}>{booking.reference}</span>
            <span>{booking.user?.name || "N/A"}</span>
            <span>
              {booking.listing?.origin} → {booking.listing?.destination}
            </span>
            <span>₦{booking.totalPrice?.toLocaleString()}</span>
            <span style={{ ...styles.badge, ...getBadgeStyle(booking.status) }}>
              {booking.status}
            </span>
            <div style={styles.actions}>
              {booking.status === "pending" && (
                <button
                  style={styles.confirmBtn}
                  onClick={() => updateStatus(booking._id, "confirmed")}
                >
                  Confirm
                </button>
              )}
              {booking.status !== "cancelled" && (
                <button
                  style={styles.cancelBtn}
                  onClick={() => updateStatus(booking._id, "cancelled")}
                >
                  Cancel
                </button>
              )}
              <button
                style={styles.deleteBtn}
                onClick={() => deleteBooking(booking._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getBadgeStyle = (status) => {
  if (status === "confirmed")
    return { background: "#f0faf0", color: "#2d7a2d" };
  if (status === "pending") return { background: "#fff8e6", color: "#b06d00" };
  if (status === "cancelled") return { background: "#fff0f0", color: "#c00" };
  return {};
};

const styles = {
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "4px",
    letterSpacing: "-0.5px",
  },
  count: { fontSize: "13px", color: "#888", marginBottom: "24px" },
  table: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr 1.5fr",
    padding: "12px 20px",
    background: "#f9f9f9",
    borderBottom: "1px solid #eee",
    fontSize: "11px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr 1.5fr",
    padding: "14px 20px",
    borderBottom: "1px solid #f5f5f5",
    fontSize: "13px",
    color: "#333",
    alignItems: "center",
  },
  ref: { fontWeight: "600", color: "#111" },
  badge: {
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "4px",
    fontWeight: "600",
    width: "fit-content",
  },
  actions: { display: "flex", gap: "6px" },
  confirmBtn: {
    padding: "5px 10px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "5px 10px",
    background: "#fff",
    color: "#888",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "5px 10px",
    background: "#fff",
    color: "#e00",
    border: "1px solid #e00",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  empty: { padding: "24px 20px", color: "#888", fontSize: "14px" },
  loading: { color: "#888", fontSize: "14px" },
  error: { color: "#c00", fontSize: "14px" },
};
