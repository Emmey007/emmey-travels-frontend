import { useState, useEffect } from "react";
import { publicInstance } from "../api/axios";
import { BookNowButton } from "../components/BookNowButton";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export const Bus = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState([]);
  const { user } = useAuth();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await publicInstance.get("/listing?type=bus");
        setListings(res.data.listings || []);
      } catch (err) {
        setError("Could not load bus trips");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = listings.filter(
    (l) =>
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.origin?.toLowerCase().includes(search.toLowerCase()) ||
      l.destination?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleExpanded = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.hero, background: "#1a1a2e" }}>
        <h1 style={styles.heroTitle}>🚌 Bus Trips</h1>
        <p style={styles.heroSub}>
          Comfortable bus journeys across cities and countries
        </p>
        <input
          style={styles.search}
          placeholder="Search by origin, destination or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.container}>
        {loading && <p style={styles.loading}>Loading bus trips...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && filtered.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🚌</p>
            <p style={styles.emptyTitle}>No bus trips available</p>
            <p style={styles.emptyText}>
              Check back soon or contact us for custom bus packages.
            </p>
          </div>
        )}

        <div style={styles.grid}>
          {filtered.map((listing) => {
            const isExpanded = expandedIds.includes(listing._id);
            return (
              <div key={listing._id} style={styles.card}>
                <img
                  src={listing.image}
                  alt={listing.title}
                  style={styles.img}
                />
                <div style={styles.cardBody}>
                  <div style={styles.cardTop}>
                    <h3 style={styles.cardTitle}>{listing.title}</h3>
                    <span style={styles.badge}>{listing.type}</span>
                  </div>
                  <p style={styles.route}>
                    {listing.origin} → {listing.destination}
                  </p>
                  <p style={styles.continent}>{listing.continent}</p>
                  {listing.departureDate && (
                    <p style={styles.date}>
                      🗓 {new Date(listing.departureDate).toDateString()}
                    </p>
                  )}
                  {listing.duration && (
                    <p style={styles.duration}>⏱ {listing.duration}</p>
                  )}
                  <p style={styles.price}>₦{listing.price?.toLocaleString()}</p>
                  <p style={styles.seats}>
                    {listing.seatsAvailable} seats available
                  </p>
                  <p style={styles.description}>
                    {isExpanded
                      ? listing.description
                      : `${listing.description?.slice(0, 90)}...`}
                  </p>
                  <button
                    style={styles.seeMoreBtn}
                    onClick={() => toggleExpanded(listing._id)}
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                  {user && (
                    <button
                      style={{
                        ...styles.heartBtn,
                        ...(isWishlisted(listing._id)
                          ? styles.heartBtnActive
                          : {}),
                      }}
                      onClick={() =>
                        isWishlisted(listing._id)
                          ? removeFromWishlist(listing._id)
                          : addToWishlist(listing._id)
                      }
                    >
                      {isWishlisted(listing._id) ? "❤️ Saved" : "🤍 Save"}
                    </button>
                  )}
                  <BookNowButton
                    destination={{
                      id: listing._id,
                      name: listing.title,
                      country: listing.origin,
                      continent: listing.continent,
                      type: listing.type,
                      image: listing.image,
                      price: listing.price,
                      currency: listing.currency,
                      description: listing.description,
                      departureDate: listing.departureDate,
                      seatsAvailable: listing.seatsAvailable,
                      isBackend: true,
                    }}
                  />
                </div>
              </div>
            );
          })}
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
  hero: { padding: "64px 24px 48px", textAlign: "center" },
  heroTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  heroSub: { fontSize: "16px", color: "#8899bb", marginBottom: "32px" },
  search: {
    width: "100%",
    maxWidth: "480px",
    padding: "13px 18px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
  },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "0.3s",
  },
  img: { width: "100%", height: "200px", objectFit: "cover" },
  cardBody: { padding: "20px" },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#0a1628",
    flex: 1,
    marginRight: "8px",
  },
  badge: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#0a1628",
    background: "#f5e9c8",
    padding: "3px 8px",
    borderRadius: "20px",
    textTransform: "capitalize",
    flexShrink: 0,
  },
  route: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "2px",
  },
  continent: { fontSize: "12px", color: "#888", marginBottom: "8px" },
  date: { fontSize: "12px", color: "#555", marginBottom: "4px" },
  duration: { fontSize: "12px", color: "#555", marginBottom: "8px" },
  price: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#0a1628",
    marginBottom: "4px",
  },
  seats: { fontSize: "12px", color: "#888", marginBottom: "8px" },
  description: {
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "8px",
  },
  seeMoreBtn: {
    border: "none",
    background: "none",
    color: "#0a1628",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    padding: "0",
    marginBottom: "12px",
    display: "block",
  },
  heartBtn: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "all 0.2s",
  },
  heartBtnActive: {
    background: "#fff5f5",
    borderColor: "#ffcccc",
    color: "#c00",
  },
  empty: { textAlign: "center", padding: "80px 0" },
  emptyIcon: { fontSize: "56px", marginBottom: "16px" },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "8px",
  },
  emptyText: { fontSize: "14px", color: "#888" },
  loading: {
    color: "#888",
    fontSize: "14px",
    textAlign: "center",
    padding: "40px 0",
  },
  error: {
    color: "#c00",
    fontSize: "14px",
    textAlign: "center",
    padding: "40px 0",
  },
};
