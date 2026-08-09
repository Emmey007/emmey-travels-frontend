import { useState, useEffect } from "react";
import { privateInstance } from "../api/axios";

export const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replying, setReplying] = useState({});

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await privateInstance.get("/enquiry");
      setEnquiries(res.data.enquiries || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (id) => {
    if (!replyText[id]) return;
    try {
      setReplying((prev) => ({ ...prev, [id]: true }));
      await privateInstance.put(`/enquiry/${id}/reply`, {
        adminReply: replyText[id],
      });
      setEnquiries(
        enquiries.map((e) =>
          e._id === id
            ? { ...e, adminReply: replyText[id], status: "resolved" }
            : e,
        ),
      );
      setReplyText((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reply");
    } finally {
      setReplying((prev) => ({ ...prev, [id]: false }));
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await privateInstance.delete(`/enquiry/${id}`);
      setEnquiries(enquiries.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete enquiry");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  if (loading) return <p style={styles.loading}>Loading enquiries...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div>
      <h1 style={styles.title}>Enquiries</h1>
      <p style={styles.count}>
        {enquiries.length} enquir{enquiries.length !== 1 ? "ies" : "y"} total
      </p>

      {enquiries.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>📬</p>
          <p style={styles.emptyText}>No enquiries yet</p>
        </div>
      )}

      <div style={styles.list}>
        {enquiries.map((enquiry) => (
          <div key={enquiry._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {enquiry.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={styles.name}>{enquiry.name}</p>
                  <p style={styles.email}>{enquiry.email}</p>
                  <p style={styles.date}>
                    {new Date(enquiry.createdAt).toDateString()}
                  </p>
                </div>
              </div>
              <div style={styles.cardActions}>
                <span
                  style={{
                    ...styles.badge,
                    ...(enquiry.status === "resolved"
                      ? styles.resolved
                      : styles.open),
                  }}
                >
                  {enquiry.status}
                </span>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteEnquiry(enquiry._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div style={styles.messageBox}>
              <p style={styles.messageLabel}>Message</p>
              <p style={styles.messageText}>{enquiry.message}</p>
            </div>

            {enquiry.adminReply && (
              <div style={styles.replyBox}>
                <p style={styles.replyLabel}>Your reply</p>
                <p style={styles.replyText}>{enquiry.adminReply}</p>
              </div>
            )}

            {enquiry.status !== "resolved" && (
              <div style={styles.replyForm}>
                <textarea
                  placeholder="Write a reply to this enquiry..."
                  style={styles.textarea}
                  value={replyText[enquiry._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [enquiry._id]: e.target.value,
                    }))
                  }
                />
                <button
                  style={styles.replyBtn}
                  onClick={() => sendReply(enquiry._id)}
                  disabled={replying[enquiry._id]}
                >
                  {replying[enquiry._id] ? "Sending..." : "Send reply"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
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
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  userInfo: { display: "flex", alignItems: "flex-start", gap: "12px" },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#0a1628",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
  },
  name: { fontSize: "14px", fontWeight: "700", color: "#111", margin: 0 },
  email: { fontSize: "12px", color: "#888", margin: "2px 0" },
  date: { fontSize: "11px", color: "#bbb", margin: 0 },
  cardActions: { display: "flex", alignItems: "center", gap: "8px" },
  badge: {
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  resolved: { background: "#f0faf0", color: "#2d7a2d" },
  open: { background: "#fff8e6", color: "#b06d00" },
  deleteBtn: {
    padding: "6px 12px",
    background: "#fff",
    color: "#e00",
    border: "1px solid #e00",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  messageBox: {
    background: "#f9f9f9",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "14px 16px",
    marginBottom: "12px",
  },
  messageLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "6px",
  },
  messageText: { fontSize: "14px", color: "#333", lineHeight: "1.6" },
  replyBox: {
    background: "#f0faf0",
    border: "1px solid #c3e6c3",
    borderRadius: "8px",
    padding: "14px 16px",
    marginBottom: "12px",
  },
  replyLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#2d7a2d",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "6px",
  },
  replyText: { fontSize: "13px", color: "#333", lineHeight: "1.6" },
  replyForm: { display: "flex", flexDirection: "column", gap: "8px" },
  textarea: {
    width: "100%",
    padding: "11px 13px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  },
  replyBtn: {
    alignSelf: "flex-end",
    padding: "9px 20px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  empty: { textAlign: "center", padding: "60px 0" },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },
  emptyText: { fontSize: "14px", color: "#888" },
  loading: { color: "#888", fontSize: "14px" },
  error: { color: "#c00", fontSize: "14px" },
};
