import { useState } from "react";
import { BookNowButton } from "./BookNowButton";

export const ListingCard = ({ place }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="listing-card">
      <img
        src={place.image}
        alt={place.name}
        style={{
          width: "100%",
          height: "240px",
          objectFit: "cover",
          display: "block",
        }}
      />

      <div className="listing-card-content">
        <h3>{place.name}</h3>

        <p>{place.type}</p>

        <p>
          {place.country} · {place.continent}
        </p>

        {place.price && (
          <p>₦{place.price.toLocaleString()}</p>
        )}

        {place.description && (
          <p>
            {expanded
              ? place.description
              : `${place.description.slice(0, 90)}...`}
          </p>
        )}

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