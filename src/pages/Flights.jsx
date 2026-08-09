import { useState, useEffect } from "react";
import "./Home.css";
import { publicInstance } from "../api/axios";
import { ListingCard } from "../components/ListingCard";

const normalizeListing = (l) => ({
  _id: l._id,
  id: l._id,
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
});

export const Flights = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await publicInstance.get("/listing?type=flight");
        setListings((res.data.listings || []).map(normalizeListing));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load flights");
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const filtered = listings.filter(
    (place) =>
      place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.country?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="destinations">
      <div className="title">
        <h1>Flights</h1>
        <p>Browse available flight listings and book your next trip.</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by destination or origin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p className="loading-text">Loading flights...</p>}
      {error && <p className="loading-text">{error}</p>}

      <div className="destination-grid">
        {!loading && filtered.length === 0 ? (
          <p className="no-results">No flights available right now.</p>
        ) : (
          filtered.map((place) => <ListingCard place={place} key={place.id} />)
        )}
      </div>
    </section>
  );
};