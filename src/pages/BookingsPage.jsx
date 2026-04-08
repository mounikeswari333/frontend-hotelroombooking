import { useEffect, useState } from "react";
import AlertMessage from "../components/AlertMessage";
import Footer from "../components/Footer/Footer";
import "./BookingsPage.css";

function BookingsList({ bookings, onCancel, onUpdate, loadingId }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ check_in: "", check_out: "" });

  const startEdit = (booking) => {
    setEditingId(booking.id);
    setEditForm({ check_in: booking.check_in, check_out: booking.check_out });
  };

  const saveEdit = async (bookingId) => {
    await onUpdate(bookingId, editForm);
    setEditingId(null);
  };

  if (!bookings.length) {
    return (
      <p className="empty-state">No bookings yet. Book your first room!</p>
    );
  }

  return (
    <div className="bookings-list">
      {bookings.map((booking) => (
        <article key={booking.id} className="booking-item">
          <div className="booking-image">
            <img src={booking.image_url} alt={booking.hotel_name} />
          </div>

          <div className="booking-details">
            <h3>{booking.hotel_name}</h3>
            <p className="booking-room">
              Room {booking.room_number} • {booking.city}
            </p>
            <p className="booking-dates">
              {booking.check_in} to {booking.check_out}
            </p>
            <p
              className={`booking-status ${booking.status === "BOOKED" ? "booked" : "canceled"}`}
            >
              {booking.status}
            </p>
          </div>

          {editingId === booking.id ? (
            <div className="edit-form">
              <input
                type="date"
                value={editForm.check_in}
                onChange={(e) =>
                  setEditForm({ ...editForm, check_in: e.target.value })
                }
              />
              <input
                type="date"
                value={editForm.check_out}
                onChange={(e) =>
                  setEditForm({ ...editForm, check_out: e.target.value })
                }
              />
              <button type="button" onClick={() => saveEdit(booking.id)}>
                Save
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="booking-actions">
              {booking.status === "BOOKED" && (
                <>
                  <button type="button" onClick={() => startEdit(booking)}>
                    Edit
                  </button>
                  <button
                    className="danger"
                    disabled={loadingId === booking.id}
                    type="button"
                    onClick={() => onCancel(booking.id)}
                  >
                    {loadingId === booking.id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                </>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function BookingsPage({
  bookings,
  fetchBookings,
  onCancelBooking,
  onUpdateBooking,
  loadingId,
  message,
}) {
  useEffect(() => {
    fetchBookings();
    // Run once when page opens to show latest bookings after payment flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bookings-page">
      <main className="page-container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <button onClick={fetchBookings} className="refresh-btn" type="button">
            ↻ Refresh
          </button>
        </div>

        <AlertMessage type={message.type} message={message.text} />

        <BookingsList
          bookings={bookings}
          onCancel={onCancelBooking}
          onUpdate={onUpdateBooking}
          loadingId={loadingId}
        />
      </main>

      <Footer />
    </div>
  );
}

export default BookingsPage;
