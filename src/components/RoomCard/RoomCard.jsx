import { FaWifi, FaTv, FaSnowflake, FaHeart, FaRegHeart } from "react-icons/fa";
import "./RoomCard.css";

function RoomCard({ room, onBookClick, isFavorite, onToggleFavorite }) {
  const amenities = {
    AC: room.type === "AC",
    WiFi: true,
    TV: true,
  };

  return (
    <article className="room-card">
      <div className="room-image-wrapper">
        <img
          src={room.image_url}
          alt={room.hotel_name}
          className="room-image"
        />
        <button
          className="favorite-btn"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(room.id);
          }}
          title="Add to favorites"
          type="button"
        >
          {isFavorite ? <FaHeart className="heart-filled" /> : <FaRegHeart />}
        </button>
        {!room.available && <span className="booked-badge">Booked</span>}
      </div>

      <div className="room-content">
        <h3>{room.hotel_name}</h3>
        <p className="room-number">
          Room {room.room_number} • {room.city}
        </p>

        <div className="amenities">
          {amenities.AC && (
            <span className="amenity" title="AC">
              <FaSnowflake /> AC
            </span>
          )}
          {amenities.WiFi && (
            <span className="amenity" title="WiFi">
              <FaWifi /> WiFi
            </span>
          )}
          {amenities.TV && (
            <span className="amenity" title="TV">
              <FaTv /> TV
            </span>
          )}
        </div>

        <div className="room-footer">
          <div>
            <p className="price">₹{room.price}</p>
            <p className="per-night">per night</p>
          </div>
          <button
            className={`book-btn ${!room.available ? "disabled" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              onBookClick(room);
            }}
            disabled={!room.available}
            type="button"
          >
            {room.available ? "Book Now" : "Not Available"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default RoomCard;
