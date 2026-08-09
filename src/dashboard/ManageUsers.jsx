import { useState, useEffect } from "react";
import { privateInstance } from "../api/axios";

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await privateInstance.get("/user");
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await privateInstance.delete(`/user/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div>
      <h1 style={styles.title}>Manage Users</h1>
      <p style={styles.count}>{users.length} users total</p>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Role</span>
          <span>Verified</span>
          <span>Actions</span>
        </div>
        {users.length === 0 && <p style={styles.empty}>No users yet</p>}
        {users.map((user) => (
          <div key={user._id} style={styles.tableRow}>
            <div style={styles.userCell}>
              <div style={styles.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={styles.userName}>{user.name}</span>
            </div>
            <span>{user.email}</span>
            <span>{user.phone || "N/A"}</span>
            <span style={{ ...styles.badge, ...getRoleBadge(user.role) }}>
              {user.role}
            </span>
            <span
              style={{
                ...styles.badge,
                ...(user.isVerified ? styles.verified : styles.unverified),
              }}
            >
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteUser(user._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const getRoleBadge = (role) => {
  if (role === "superadmin") return { background: "#111", color: "#fff" };
  if (role === "admin") return { background: "#f0f0f0", color: "#111" };
  return { background: "#f9f9f9", color: "#666" };
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
    gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr",
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
    gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr",
    padding: "14px 20px",
    borderBottom: "1px solid #f5f5f5",
    fontSize: "13px",
    color: "#333",
    alignItems: "center",
  },
  userCell: { display: "flex", alignItems: "center", gap: "8px" },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
    flexShrink: 0,
  },
  userName: { fontWeight: "600", color: "#111" },
  badge: {
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "4px",
    fontWeight: "600",
    width: "fit-content",
  },
  verified: { background: "#f0faf0", color: "#2d7a2d" },
  unverified: { background: "#fff0f0", color: "#c00" },
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
