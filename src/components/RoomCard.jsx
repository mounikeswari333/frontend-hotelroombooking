import { Link } from "react-router-dom";

function RoomCard({ room }) {
  return (
    <article className="room-card">
      <img src={room.image_url} alt={room.hotel_name} className="room-image" />
      <div className="room-content">
        <h3>{room.hotel_name}</h3>
        <p>
          Room {room.room_number} • {room.city}
        </p>
        <p>
          {room.type} • Rs.{room.price} / night
        </p>

        <div className="room-footer">
          <span className={`status ${room.available ? "available" : "booked"}`}>
            {room.available ? "Available" : "Booked"}
          </span>

          <Link
            className="book-btn"
            to={`/book?roomId=${room.id}`}
            aria-disabled={!room.available}
            onClick={(event) => {
              if (!room.available) {
                event.preventDefault();
              }
            }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}

export default RoomCard;
