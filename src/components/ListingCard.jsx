import { useState } from "react";
import { BookNowButton } from "./BookNowButton";

// Expects a normalized "place" object shaped like:
// { id, name, country, continent, type, image, price, currency, description }
export const ListingCard = ({ place }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
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
          {expanded
            ? place.description
            : `${place.description?.slice(0, 90)}...`}
        </p>
        <button
          className="see-more-btn"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "See less" : "See more"}
        </button>
        <BookNowButton destination={place} />
      </div>
    </div>
  );
};