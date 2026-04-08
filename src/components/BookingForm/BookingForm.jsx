import { useMemo, useState } from "react";
import AlertMessage from "../AlertMessage";
import "./BookingForm.css";

function BookingForm({ rooms, onCreateBooking, loading, initialRoomId = "" }) {
  const [form, setForm] = useState({
    room_id: initialRoomId,
    check_in: "",
    check_out: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableRooms = useMemo(
    () => rooms.filter((room) => room.available),
    [rooms],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.room_id || !form.check_in || !form.check_out) {
      setError("Please select room and both dates.");
      return;
    }

    if (new Date(form.check_out) <= new Date(form.check_in)) {
      setError("Check-out must be after check-in.");
      return;
    }

    const message = await onCreateBooking({
      room_id: Number(form.room_id),
      check_in: form.check_in,
      check_out: form.check_out,
    });

    if (message.type === "error") {
      setError(message.text);
      return;
    }

    setSuccess(message.text);
    setForm((prev) => ({ ...prev, room_id: "" }));
  };

  return (
    <section className="booking-form-card">
      <h2>Create Booking</h2>

      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Room
          <select name="room_id" value={form.room_id} onChange={handleChange}>
            <option value="">Select available room</option>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room_number} - {room.hotel_name} ({room.city})
              </option>
            ))}
          </select>
        </label>

        <label>
          Check-in
          <input
            type="date"
            name="check_in"
            value={form.check_in}
            onChange={handleChange}
          />
        </label>

        <label>
          Check-out
          <input
            type="date"
            name="check_out"
            value={form.check_out}
            onChange={handleChange}
          />
        </label>

        <button disabled={loading} type="submit">
          {loading ? "Booking..." : "Book Room"}
        </button>
      </form>

      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
    </section>
  );
}

export default BookingForm;
