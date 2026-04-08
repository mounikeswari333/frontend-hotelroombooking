import { useState } from "react";

function BookingList({ bookings, onCancel, onUpdate, loadingId }) {
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
      <p className="empty-state">No bookings yet. Book your first room.</p>
    );
  }

  return (
    <section className="card">
      <h2>My Bookings</h2>

      <div className="booking-list">
        {bookings.map((booking) => (
          <article className="booking-item" key={booking.id}>
            <div>
              <h3>
                {booking.hotel_name} • Room {booking.room_number}
              </h3>
              <p>{booking.city}</p>
              <p>
                {booking.check_in} to {booking.check_out}
              </p>
              <p
                className={`status ${booking.status === "BOOKED" ? "available" : "booked"}`}
              >
                {booking.status}
              </p>
            </div>

            {editingId === booking.id ? (
              <div className="edit-box">
                <input
                  type="date"
                  value={editForm.check_in}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      check_in: event.target.value,
                    }))
                  }
                />
                <input
                  type="date"
                  value={editForm.check_out}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      check_out: event.target.value,
                    }))
                  }
                />
                <button type="button" onClick={() => saveEdit(booking.id)}>
                  Save
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="actions">
                {booking.status === "BOOKED" && (
                  <>
                    <button type="button" onClick={() => startEdit(booking)}>
                      Edit
                    </button>
                    <button
                      className="danger"
                      type="button"
                      disabled={loadingId === booking.id}
                      onClick={() => onCancel(booking.id)}
                    >
                      {loadingId === booking.id ? "Cancelling..." : "Cancel"}
                    </button>
                  </>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default BookingList;
