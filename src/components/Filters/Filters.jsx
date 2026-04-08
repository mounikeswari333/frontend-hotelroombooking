import { FaWifi, FaTv, FaSnowflake } from "react-icons/fa";
import "./Filters.css";

function Filters({ filters, setFilters }) {
  const amenities = [
    { id: "ac", label: "AC", icon: <FaSnowflake /> },
    { id: "wifi", label: "WiFi", icon: <FaWifi /> },
    { id: "tv", label: "TV", icon: <FaTv /> },
  ];

  const toggleAmenity = (amenity) => {
    const selected = filters.amenities || [];
    if (selected.includes(amenity)) {
      setFilters({
        ...filters,
        amenities: selected.filter((a) => a !== amenity),
      });
    } else {
      setFilters({ ...filters, amenities: [...selected, amenity] });
    }
  };

  const toggleRating = (rating) => {
    const selected = filters.ratings || [];
    if (selected.includes(rating)) {
      setFilters({
        ...filters,
        ratings: selected.filter((item) => item !== rating),
      });
    } else {
      setFilters({
        ...filters,
        ratings: [...selected, rating],
      });
    }
  };

  return (
    <div className="filters-section">
      <h3>Filters</h3>

      <div className="amenities-filter">
        <p className="filter-label">Amenities</p>
        <div className="amenity-buttons">
          {amenities.map((amenity) => (
            <button
              key={amenity.id}
              className={`amenity-filter-btn ${
                (filters.amenities || []).includes(amenity.id) ? "active" : ""
              }`}
              onClick={() => toggleAmenity(amenity.id)}
              type="button"
            >
              {amenity.icon}
              {amenity.label}
            </button>
          ))}
        </div>
      </div>

      <div className="price-filter">
        <p className="filter-label">
          Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}
        </p>
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: Number(e.target.value) })
          }
          className="price-slider"
        />
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="price-slider"
        />
      </div>

      <div className="ratings-filter">
        <p className="filter-label">Star Rating</p>
        {[2, 3, 4, 5].map((rating) => (
          <label key={rating} className="rating-option">
            <input
              type="checkbox"
              checked={(filters.ratings || []).includes(rating)}
              onChange={() => toggleRating(rating)}
            />
            <span>{rating} Star</span>
            <span className="stars">
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default Filters;
