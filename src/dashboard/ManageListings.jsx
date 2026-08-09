import { useState, useEffect } from "react";
import { privateInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

export const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await privateInstance.get("/listing");
      setListings(res.data.listings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await privateInstance.delete(`/listing/${id}`);
      setListings(listings.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Listings</h1>
          <p style={styles.count}>{listings.length} listings total</p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => navigate("/dashboard/add-listing")}
        >
          + Add listing
        </button>
      </div>

      <div style={styles.grid}>
        {listings.length === 0 && <p style={styles.empty}>No listings yet</p>}
        {listings.map((listing) => (
          <div key={listing._id} style={styles.card}>
            <img src={listing.image} alt={listing.title} style={styles.img} />
            <div style={styles.cardBody}>
              <span style={styles.type}>{listing.type}</span>
              <h3 style={styles.cardTitle}>{listing.title}</h3>
              <p style={styles.route}>
                {listing.origin} → {listing.destination}
              </p>
              <p style={styles.price}>₦{listing.price?.toLocaleString()}</p>
              <p style={styles.seats}>
                {listing.seatsAvailable} seats available
              </p>
              <div style={styles.cardActions}>
                <button
                  style={styles.editBtn}
                  onClick={() => navigate(`/dashboard/listings/${listing._id}`)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteListing(listing._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "4px",
    letterSpacing: "-0.5px",
  },
  count: { fontSize: "13px", color: "#888" },
  addBtn: {
    padding: "10px 20px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  img: { width: "100%", height: "160px", objectFit: "cover" },
  cardBody: { padding: "16px" },
  type: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111",
    margin: "6px 0 4px",
  },
  route: { fontSize: "13px", color: "#666", marginBottom: "4px" },
  price: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "4px",
  },
  seats: { fontSize: "12px", color: "#888", marginBottom: "12px" },
  cardActions: { display: "flex", gap: "8px" },
  editBtn: {
    flex: 1,
    padding: "8px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: "8px",
    background: "#fff",
    color: "#e00",
    border: "1px solid #e00",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  empty: { color: "#888", fontSize: "14px" },
  loading: { color: "#888", fontSize: "14px" },
  error: { color: "#c00", fontSize: "14px" },
};