import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { BookNowButton } from "../components/BookNowButton";

export const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Wishlist</h1>
        <p style={styles.sub}>
          {wishlist.length} saved destination{wishlist.length !== 1 ? "s" : ""}
        </p>

        {wishlist.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🤍</p>
            <p style={styles.emptyTitle}>Your wishlist is empty</p>
            <p style={styles.emptyText}>
              Save destinations you love and come back to them anytime.
            </p>
            <button style={styles.exploreBtn} onClick={() => navigate("/")}>
              Explore Destinations
            </button>
          </div>
        )}

        <div style={styles.grid}>
          {wishlist.map((item) => {
            const listing = item.listing;
            if (!listing) return null;
            return (
              <div key={item._id} style={styles.card}>
                <div style={styles.imgWrap}>
                  <img
                    src={listing.image}
                    alt={listing.title}
                    style={styles.img}
                  />
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromWishlist(listing._id)}
                  >
                    ❤️ Remove
                  </button>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardTop}>
                    <h3 style={styles.cardTitle}>{listing.title}</h3>
                    <span style={styles.badge}>{listing.type}</span>
                  </div>
                  <p style={styles.route}>
                    {listing.origin} → {listing.destination}
                  </p>
                  <p style={styles.continent}>{listing.continent}</p>
                  <p style={styles.price}>₦{listing.price?.toLocaleString()}</p>
                  {listing.departureDate && (
                    <p style={styles.date}>
                      Departs: {new Date(listing.departureDate).toDateString()}
                    </p>
                  )}
                  <p style={styles.description}>
                    {listing.description?.slice(0, 100)}...
                  </p>
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
    background: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "4px",
    letterSpacing: "-0.5px",
  },
  sub: { fontSize: "14px", color: "#888", marginBottom: "32px" },
  empty: { textAlign: "center", padding: "80px 0" },
  emptyIcon: { fontSize: "56px", marginBottom: "16px" },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "8px",
  },
  emptyText: { fontSize: "14px", color: "#888", marginBottom: "24px" },
  exploreBtn: {
    padding: "12px 28px",
    background: "#0a1628",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
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
  },
  imgWrap: { position: "relative" },
  img: { width: "100%", height: "200px", objectFit: "cover" },
  removeBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#c00",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  cardBody: { padding: "16px" },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "6px",
  },
  cardTitle: { fontSize: "16px", fontWeight: "800", color: "#0a1628" },
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
  price: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#0a1628",
    marginBottom: "4px",
  },
  date: { fontSize: "12px", color: "#888", marginBottom: "8px" },
  description: {
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "16px",
  },
};
