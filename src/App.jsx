import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { api } from "./api/client";
import SimpleNavbar from "./components/Navbar/Navbar";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import FavoritesPage from "./pages/FavoritesPage";
import Home from "./pages/Home/Home";
import HotelDetails from "./pages/HotelDetails/HotelDetails";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function App() {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [bookingMessage, setBookingMessage] = useState({ type: "", text: "" });
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const { data } = await api.get("/rooms");
      setRooms(data);
    } catch {
      setRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch {
      setBookings([]);
    }
  };

  const onCreateBooking = async (payload) => {
    try {
      await api.post("/book", payload);
      setBookingMessage({ type: "success", text: "Room booked successfully" });
      await Promise.all([fetchBookings(), fetchRooms()]);
      return { type: "success", text: "Room booked successfully" };
    } catch (error) {
      return {
        type: "error",
        text: error.response?.data?.message || "Booking failed",
      };
    }
  };

  const onCancelBooking = async (bookingId) => {
    setLoadingId(bookingId);
    try {
      await api.delete(`/booking/${bookingId}`);
      setBookingMessage({ type: "success", text: "Booking canceled" });
      await Promise.all([fetchBookings(), fetchRooms()]);
    } catch (error) {
      setBookingMessage({
        type: "error",
        text: error.response?.data?.message || "Cancel failed",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const onUpdateBooking = async (bookingId, payload) => {
    if (new Date(payload.check_out) <= new Date(payload.check_in)) {
      setBookingMessage({
        type: "error",
        text: "Check-out must be after check-in",
      });
      return;
    }
    try {
      await api.put(`/booking/${bookingId}`, payload);
      setBookingMessage({ type: "success", text: "Booking updated" });
      await Promise.all([fetchBookings(), fetchRooms()]);
    } catch (error) {
      setBookingMessage({
        type: "error",
        text: error.response?.data?.message || "Update failed",
      });
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <>
      <SimpleNavbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route
          path="/book"
          element={
            <RequireAuth>
              <BookingPage
                rooms={rooms}
                loading={roomsLoading}
                onCreateBooking={onCreateBooking}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/bookings"
          element={
            <RequireAuth>
              <BookingsPage
                bookings={bookings}
                fetchBookings={fetchBookings}
                onCancelBooking={onCancelBooking}
                onUpdateBooking={onUpdateBooking}
                loadingId={loadingId}
                message={bookingMessage}
              />
            </RequireAuth>
          }
        />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;
