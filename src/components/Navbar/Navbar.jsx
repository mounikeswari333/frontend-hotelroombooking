import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function SimpleNavbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏨 Hotel Booking
        </Link>

        <nav className="navbar-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/book" className="nav-link">
            Book
          </Link>
          <Link to="/bookings" className="nav-link">
            My Bookings
          </Link>
          <Link to="/favorites" className="nav-link favorites-link">
            Favorites
          </Link>

          {isAuthenticated ? (
            <button onClick={handleLogout} className="logout-btn" type="button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default SimpleNavbar;
