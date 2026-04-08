import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BookingForm from "../components/BookingForm/BookingForm";
import RoomCard from "../components/RoomCard/RoomCard";
import Footer from "../components/Footer/Footer";
import "./BookingPage.css";

function BookingPage({ rooms, loading, onCreateBooking }) {
  const [searchParams] = useSearchParams();
  const roomIdFromQuery = useMemo(
    () => searchParams.get("roomId") || "",
    [searchParams],
  );

  return (
    <div className="booking-page">
      <main className="page-container">
        <h1>Book Your Room</h1>

        <div className="booking-layout">
          <BookingForm
            key={roomIdFromQuery || "default-room"}
            rooms={rooms}
            onCreateBooking={onCreateBooking}
            loading={loading}
            initialRoomId={roomIdFromQuery}
          />

          <section className="available-rooms-section">
            <h2>Available Rooms</h2>
            <p className="section-note">Only available rooms can be booked</p>

            <div className="rooms-list">
              {rooms
                .filter((room) => room.available)
                .slice(0, 6)
                .map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onBookClick={() => {}}
                    isFavorite={false}
                    onToggleFavorite={() => {}}
                  />
                ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookingPage;
