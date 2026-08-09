import { useState, useEffect } from "react";
import "./Home.css";
import { useAuth } from "../context/AuthContext";
import { publicInstance } from "../api/axios";
import { BookNowButton } from "../components/BookNowButton";
import { useWishlist } from '../context/WishlistContext'
import santorini from "../assets/images/santorini.jpg";
import dubai from "../assets/images/dubai.jpg";
import paris from "../assets/images/paris.jpg";
import maldives from "../assets/images/maldives.jpg";
import bali from "../assets/images/bali.jpg";
import tokyo from "../assets/images/tokyo.jpg";
import capeTown from "../assets/images/capeTown.jpg";
import newYork from "../assets/images/newYork.jpg";
import venice from "../assets/images/venice.jpg";
import zanzibar from "../assets/images/zanzibar.jpg";
import ethopia from "../assets/images/ethopia.jpg";
import greenland from "../assets/images/greenland.jpg";

const hardcoded = [
  {
    id: "h1",
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    type: "boat",
    image: santorini,
    price: 4500000,
    currency: "USD",
    description:
      "Famous for its whitewashed buildings, blue-domed churches, and unforgettable sunsets over the Aegean Sea.",
  },
  {
    id: "h2",
    name: "Dubai",
    country: "UAE",
    continent: "Asia",
    type: "flight",
    image: dubai,
    price: 3800000,
    currency: "USD",
    description:
      "A city of soaring skyscrapers, luxury shopping, and desert adventures.",
  },
  {
    id: "h3",
    name: "Paris",
    country: "France",
    continent: "Europe",
    type: "flight",
    image: paris,
    price: 5200000,
    currency: "USD",
    description:
      "The City of Light — wander along the Seine, visit the Louvre, and enjoy a coffee beneath the Eiffel Tower.",
  },
  {
    id: "h4",
    name: "Maldives",
    country: "Maldives",
    continent: "Asia",
    type: "boat",
    image: maldives,
    price: 6000000,
    currency: "USD",
    description:
      "Overwater bungalows, crystal-clear lagoons, and vibrant coral reefs.",
  },
  {
    id: "h5",
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    type: "flight",
    image: bali,
    price: 3200000,
    currency: "USD",
    description:
      "Lush rice terraces, ancient temples, and world-class surf breaks.",
  },
  {
    id: "h6",
    name: "Tokyo",
    country: "Japan",
    continent: "Asia",
    type: "flight",
    image: tokyo,
    price: 4800000 ,
    currency: "USD",
    description:
      "A dazzling mix of ultramodern skyscrapers and centuries-old temples.",
  },
  {
    id: "h7",
    name: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    type: "flight",
    image: capeTown,
    price: 400000,
    currency: "USD",
    description:
      "Table Mountain, stunning beaches, and a vibrant cultural scene.",
  },
  {
    id: "h8",
    name: "New York",
    country: "USA",
    continent: "Americas",
    type: "flight",
    image: newYork,
    price: 5500000,
    currency: "USD",
    description:
      "The city that never sleeps — Broadway shows, iconic skyline views, and a melting pot of cultures.",
  },
  {
    id: "h9",
    name: "Venice",
    country: "Italy",
    continent: "Europe",
    type: "ship",
    image: venice,
    price: 4100000,
    currency: "USD",
    description:
      "Glide through winding canals aboard a gondola and lose yourself in centuries of art and romance.",
  },
  {
    id: "h10",
    name: "Zanzibar",
    country: "Tanzania",
    continent: "Africa",
    type: "boat",
    image: zanzibar,
    price: 250000,
    currency: "USD",
    description:
      "Powder-white beaches, turquoise waters, and the historic spice markets of Stone Town.",
  },
  {
    id: "h11",
    name: "Golden Night City",
    country: "Ethopia",
    continent: "Africa",
    type: "flight",
    image: ethopia,
    price: 350000,
    currency: "USD",
    description:
      "A vibrant city known for its unique architecture, rich culture, and beautiful night skyline.",
  },
  {
    id: "h12",
    name: "Arctic Village",
    country: "Greenland",
    continent: "Americas",
    type: "ship",
    image: greenland,
    price: 7000000,
    currency: "USD",
    description:
      "A land of ice and fire, with stunning glaciers, fjords, and the mesmerizing Northern Lights.",
  }
];

export const Home = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState([]);
  const [backendListings, setBackendListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist()
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await publicInstance.get("/listing");
        setBackendListings(res.data.listings || []);
      } catch (err) {
        console.log("Could not fetch listings:", err.message);
      } finally {
        setLoadingListings(false);
      }
    };
    fetchListings();
  }, []);

  const allDestinations = [
  ...backendListings.map((l) => ({
  _id: l._id,      // keep MongoDB id
  id: l._id,       // optional, for React keys
  name: l.title,
  country: l.origin,
  continent: l.continent,
  type: l.type,
  image: l.image,
  price: l.price,
  currency: l.currency,
  description: l.description,
  departureDate: l.departureDate,
  seatsAvailable: l.seatsAvailable,
  isBackend: true,
})),
    ...hardcoded,
  ];

  const filtered = allDestinations.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || place.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const toggleExpanded = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <section className="destinations">
      {user && (
        <div className="welcome-banner">
          <div>
            <h2 className="welcome-title">Welcome back, {user.name} 👋</h2>
            <p className="welcome-sub">
              Ready for your next adventure? The world is waiting.
            </p>
          </div>
          <a href="/bookings" className="welcome-btn">
            My Bookings →
          </a>
        </div>
      )}

      <div className="title">
        <h1>Popular Destinations</h1>
        <p>Discover breathtaking places around the world.</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by destination or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="type-select"
        >
          <option value="all">All Booking Types</option>
          <option value="flight">Flights</option>
          <option value="bus">Bus</option>
          <option value="ship-cruise">Ship Cruise</option>
          <option value="boat-cruise">Boat Cruise</option>
        </select>
      </div>

      {loadingListings && <p className="loading-text">Loading listings...</p>}

      <div className="destination-grid">
        {filtered.length === 0 ? (
          <p className="no-results">No destinations match your search.</p>
        ) : (
          filtered.map((place) => {
            const isExpanded = expandedIds.includes(place.id);
            return (
              <div className="card" key={place.id}>
                <img src={place.image} alt={place.name} />
                <div className="card-content">
                  <div className="card-header">
                    <h2>{place.name}</h2>
                    <span className="type-badge">{place.type}</span>
                  </div>
                  <p className="country">
                    {place.country} · {place.continent}
                  </p>
                  {place.price && (
                    <p className="price">₦{place.price.toLocaleString()}</p>
                  )}
                  <p className="description">
                    {isExpanded
                      ? place.description
                      : `${place.description?.slice(0, 90)}...`}
                  </p>
                  <button
                    className="see-more-btn"
                    onClick={() => toggleExpanded(place.id)}
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                  {user && place.isBackend && (
    <button
        className={`heart-btn ${isWishlisted(place.id) ? 'wishlisted' : ''}`}
        onClick={() =>
            isWishlisted(place.id)
                ? removeFromWishlist(place.id)
                : addToWishlist(place.id)
        }
    >
        {isWishlisted(place.id) ? '❤️ Saved' : '🤍 Save'}
    </button>
)}
                  <BookNowButton destination={place} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
