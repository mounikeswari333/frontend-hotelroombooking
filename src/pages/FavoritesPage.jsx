import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Footer from "../components/Footer/Footer";
import RoomSkeleton from "../components/RoomSkeleton";
import "./FavoritesPage.css";

function FavoritesPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/rooms");
        setRooms(data);
      } catch {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const favoriteRooms = useMemo(
    () => rooms.filter((room) => favorites.includes(room.id)),
    [favorites, rooms],
  );

  const toggleFavorite = (roomId) => {
    const next = favorites.includes(roomId)
      ? favorites.filter((id) => id !== roomId)
      : [...favorites, roomId];
    setFavorites(next);
    localStorage.setItem("favorites", JSON.stringify(next));
  };

  return (
    <div className="favorites-page">
      <main className="favorites-container">
        <h1>My Favorites</h1>

        {loading ? (
          <div className="favorites-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <RoomSkeleton key={index} />
            ))}
          </div>
        ) : favoriteRooms.length ? (
          <div className="favorites-list">
            {favoriteRooms.map((room) => (
              <article key={room.id} className="favorite-item">
                <div className="favorite-image">
                  <img src={room.image_url} alt={room.hotel_name} />
                </div>

                <div className="favorite-details">
                  <h3>{room.hotel_name}</h3>
                  <p>
                    Room {room.room_number} • {room.city}
                  </p>
                  <p>
                    {room.type} • ₹{room.price} per night
                  </p>
                </div>

                <div className="favorite-actions">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/hotel/${room.id}`, { state: { room } })
                    }
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => toggleFavorite(room.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-favorites">
            No favorite rooms yet. Tap the heart icon on any hotel to save it
            here.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default FavoritesPage;
