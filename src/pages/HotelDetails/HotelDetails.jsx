import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaSnowflake,
  FaWifi,
  FaTv,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";
import Footer from "../../components/Footer/Footer";
import NearbyMap from "../../components/NearbyMap/NearbyMap";
import "./HotelDetails.css";

function HotelDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get room data from location state or from a roomId in the URL
  const roomState = location.state?.room;
  const [stayDates, setStayDates] = useState({
    checkIn: location.state?.checkIn || "",
    checkOut: location.state?.checkOut || "",
  });
  const [room] = useState(
    roomState || {
      id: id,
      hotel_name: "Sample Hotel",
      room_number: "101",
      city: "Bengaluru",
      type: "AC",
      price: 4200,
      image_url:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      available: true,
    },
  );

  // Sample reviews for this hotel
  const reviews = [
    {
      id: 1,
      user: "Priya S.",
      date: "2 weeks ago",
      rating: 5,
      title: "Perfect stay!",
      comment:
        "The room was spacious and clean. The staff was very helpful. AC worked perfectly.",
      verified: true,
    },
    {
      id: 2,
      user: "Rajesh K.",
      date: "1 month ago",
      rating: 4,
      title: "Good value",
      comment:
        "Great WiFi speed. Room could have better lighting but overall good experience.",
      verified: true,
    },
    {
      id: 3,
      user: "Anjali P.",
      date: "1 month ago",
      rating: 5,
      title: "Excellent service",
      comment:
        "All amenities working perfectly. The TV has all channels. Highly recommended!",
      verified: true,
    },
    {
      id: 4,
      user: "Vikram S.",
      date: "2 months ago",
      rating: 4,
      title: "Comfortable stay",
      comment: "WiFi was fast, AC temperature control good. Would stay again.",
      verified: false,
    },
  ];

  const amenities = [
    {
      id: "ac",
      label: "Air Conditioning",
      icon: <FaSnowflake />,
      available: room.type === "AC",
    },
    { id: "wifi", label: "WiFi", icon: <FaWifi />, available: true },
    { id: "tv", label: "HD Smart TV", icon: <FaTv />, available: true },
  ];

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setError("");
    setPaymentSuccess(false);
    setShowPaymentPanel(true);
  };

  const handlePayment = async () => {
    if (!stayDates.checkIn || !stayDates.checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(stayDates.checkOut) <= new Date(stayDates.checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/book", {
        room_id: Number(room.id),
        check_in: stayDates.checkIn,
        check_out: stayDates.checkOut,
      });
      setPaymentSuccess(true);
    } catch (paymentError) {
      setError(paymentError.response?.data?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (
      (reviews.filter((r) => r.rating === rating).length / reviews.length) *
      100
    ).toFixed(0),
  }));

  if (paymentSuccess) {
    return (
      <div className="payment-success-page">
        <div className="payment-success-card">
          <FaCheckCircle className="success-icon" />
          <h1>Payment Successfully Completed</h1>
          <p>Your booking for {room.hotel_name} is confirmed.</p>
          <button
            type="button"
            className="pay-button"
            onClick={() => navigate("/bookings")}
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-details-page">
      {/* Header */}
      <header className="details-header">
        <button
          onClick={() => navigate("/")}
          className="back-btn"
          type="button"
        >
          <FaArrowLeft /> Back
        </button>
        <button
          className="favorite-btn"
          onClick={() => setIsFavorite(!isFavorite)}
          title="Add to favorites"
          type="button"
        >
          {isFavorite ? <FaHeart className="heart-filled" /> : <FaRegHeart />}
        </button>
      </header>

      {/* Images Section */}
      <section className="images-section">
        <div className="main-image">
          <img src={room.image_url} alt={room.hotel_name} />
        </div>

        <div className="thumbnail-row">
          <img src={room.image_url} alt="Room 1" />
          <img src={room.image_url} alt="Room 2" />
          <img src={room.image_url} alt="Room 3" />
          <img src={room.image_url} alt="Room 4" />
        </div>
      </section>

      {/* Details Section */}
      <section className="details-section">
        <div className="hotel-info">
          <h1>{room.hotel_name}</h1>
          <p className="location">
            Room {room.room_number} • {room.city}
          </p>

          <div className="rating-overview">
            <div className="rating-score">
              <span className="score-number">{averageRating.toFixed(1)}</span>
              <span className="score-label">Very Good</span>
              <p className="rating-count">{reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="rating-distribution">
              {ratingDistribution.map((dist) => (
                <div key={dist.rating} className="rating-bar">
                  <span className="rating-label">{dist.rating} ⭐</span>
                  <div className="bar">
                    <div
                      className="fill"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="percentage">{dist.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="amenities-section">
          <h3>Amenities</h3>
          <div className="amenities-list">
            {amenities.map((amenity) => (
              <div
                key={amenity.id}
                className={`amenity-item ${amenity.available ? "available" : "unavailable"}`}
              >
                <div className="amenity-icon">{amenity.icon}</div>
                <div>
                  <p className="amenity-name">{amenity.label}</p>
                  <p className="amenity-status">
                    {amenity.available ? "Available" : "Not available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price and Booking */}
        <div className="booking-section">
          <div className="price-info">
            <span className="price">₹{room.price}</span>
            <span className="per-night">per night</span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            className="book-button"
            onClick={handleBooking}
            disabled={!room.available || loading}
            type="button"
          >
            {loading
              ? "Processing..."
              : room.available
                ? "Book Now"
                : "Not Available"}
          </button>

          <p className="booking-note">Free cancellation available</p>

          {showPaymentPanel && (
            <div className="payment-panel">
              <h3>Booking Details</h3>
              <p>
                {room.hotel_name} • Room {room.room_number}
              </p>

              <div className="payment-dates">
                <label>
                  Check-in
                  <input
                    type="date"
                    value={stayDates.checkIn}
                    onChange={(event) =>
                      setStayDates((prev) => ({
                        ...prev,
                        checkIn: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Check-out
                  <input
                    type="date"
                    value={stayDates.checkOut}
                    onChange={(event) =>
                      setStayDates((prev) => ({
                        ...prev,
                        checkOut: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              {!paymentSuccess ? (
                <button
                  className="pay-button"
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Processing Payment..." : "Pay Now"}
                </button>
              ) : (
                <div className="payment-success">
                  <FaCheckCircle className="success-icon" />
                  <h4>Payment Successfully Completed</h4>
                  <p>Your room has been booked successfully.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-details-section">
        <h2>Guest Reviews</h2>

        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header-details">
                <div>
                  <p className="review-user">{review.user}</p>
                  <p className="review-date">{review.date}</p>
                </div>
                <div className="review-rating-stars">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
              </div>
              <h4>{review.title}</h4>
              <p className="review-comment">{review.comment}</p>
              {review.verified && (
                <span className="verified-badge">✓ Verified Guest</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <NearbyMap city={room.city} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HotelDetails;
