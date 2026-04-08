import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ searchFilters, setSearchFilters, cities }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="nav-top">
        <Link to="/" className="brand">
          Hotel Booking
        </Link>

        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/book">Book</NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="logout-btn" type="button">
              Logout
            </button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </div>

      <div className="search-strip">
        <div className="search-cell">
          <label htmlFor="search" className="search-label">
            Search
          </label>
          <input
            id="search"
            name="search"
            value={searchFilters.search}
            onChange={handleChange}
            placeholder="City, hotel or neighborhood"
          />
        </div>

        <div className="search-cell">
          <label htmlFor="city" className="search-label">
            Select City
          </label>
          <input
            id="city"
            list="city-list"
            name="city"
            value={searchFilters.city}
            onChange={handleChange}
            placeholder="All cities"
          />
          <datalist id="city-list">
            {cities.map((city) => (
              <option value={city} key={city} />
            ))}
          </datalist>
        </div>

        <div className="search-cell">
          <label htmlFor="checkIn" className="search-label">
            Check-in
          </label>
          <input
            id="checkIn"
            type="date"
            name="checkIn"
            value={searchFilters.checkIn}
            onChange={handleChange}
          />
        </div>

        <div className="search-cell">
          <label htmlFor="checkOut" className="search-label">
            Check-out
          </label>
          <input
            id="checkOut"
            type="date"
            name="checkOut"
            value={searchFilters.checkOut}
            onChange={handleChange}
          />
        </div>

        <div className="search-cell button-cell">
          <button
            type="button"
            className="search-btn"
            onClick={() => navigate("/")}
          >
            Search
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
