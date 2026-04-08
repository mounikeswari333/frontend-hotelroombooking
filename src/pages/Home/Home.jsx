import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../../api/client";
import Filters from "../../components/Filters/Filters";
import Footer from "../../components/Footer/Footer";
import MemberSelector from "../../components/MemberSelector/MemberSelector";
import NearbyMap from "../../components/NearbyMap/NearbyMap";
import Reviews from "../../components/Reviews/Reviews";
import RoomCard from "../../components/RoomCard/RoomCard";
import RoomSkeleton from "../../components/RoomSkeleton";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [roomGroups, setRoomGroups] = useState([{ adults: 2, children: 0 }]);

  const [searchForm, setSearchForm] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
  });

  const [filters, setFilters] = useState({
    amenities: [],
    ratings: [],
    minPrice: 1000,
    maxPrice: 10000,
  });
  const guestDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const resultsSectionRef = useRef(null);

  const markSomeRoomsUnavailable = (roomList) => {
    return roomList.map((room, index) => ({
      ...room,
      available: index % 4 === 0 ? false : room.available,
    }));
  };

  const trendingDestinations = [
    {
      id: 1,
      name: "Bengaluru",
      flag: "🇮🇳",
      image:
        "https://media-cdn.tripadvisor.com/media/photo-s/2c/21/20/c9/facadenight.jpg",
    },
    {
      id: 2,
      name: "Hyderabad",
      flag: "🇮🇳",
      image:
        "https://cdn.sanity.io/images/ocl5w36p/prod5/9bb90395c89e8082776e4394879b3d0f55f47948-1290x834.jpg?w=480&auto=format&dpr=2",
    },
    {
      id: 3,
      name: "Mumbai",
      flag: "🇮🇳",
      image:
        "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Chennai",
      flag: "🇮🇳",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Delhi",
      flag: "🇮🇳",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const collections = [
    {
      id: 1,
      title: "Couple Retreats",
      description: "Romantic stays for couples in Bangalore",
      image:
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "Luxury Stays",
      description: "Indulge in Bangalore's finest accommodations",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/349706377.jpg?k=150550b462017ba96f2412e2f607055ebe9741a25353831277e339ebac613f1e&o=",
    },
    {
      id: 3,
      title: "Nightlife Stays",
      description: "Stay close to Bangalore's vibrant nightlife spots",
      image:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "Nature Retreat",
      description: "Escape to nature in Bangalore's serene hotels",
      image:
        "data:image/jpeg;base64,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",
    },
    {
      id: 5,
      title: "Lush Pools",
      description: "Dive into refreshing bliss",
      image:
        "https://static.vecteezy.com/system/resources/previews/054/644/485/large_2x/luxurious-tropical-villa-with-private-swimming-pool-and-lush-garden-photo.jpg",
    },
  ];

  const passengerSummary = useMemo(() => {
    const totalRooms = roomGroups.length;
    const totalPassengers = roomGroups.reduce(
      (sum, room) => sum + room.adults + room.children,
      0,
    );

    if (totalRooms === 0 || totalPassengers === 0) {
      return "Select rooms & passengers";
    }

    return `${totalRooms} room${totalRooms > 1 ? "s" : ""}, ${totalPassengers} passenger${totalPassengers > 1 ? "s" : ""}`;
  }, [roomGroups]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await api.get("/cities");
        setCities(data);
      } catch {
        setCities([]);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchInitialRooms = async () => {
      setSearchPerformed(true);
      setLoading(true);

      try {
        const { data } = await api.get("/rooms");
        setRooms(markSomeRoomsUnavailable(data));
      } catch {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialRooms();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target)
      ) {
        setGuestOpen(false);
      }

      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setDateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const saveFavorites = (newFavorites) => {
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (roomId) => {
    if (favorites.includes(roomId)) {
      saveFavorites(favorites.filter((id) => id !== roomId));
    } else {
      saveFavorites([...favorites, roomId]);
    }
  };

  const handleSearch = async () => {
    if (!searchForm.city || !searchForm.checkIn || !searchForm.checkOut) {
      alert("Please fill in all search fields");
      return;
    }

    if (new Date(searchForm.checkOut) <= new Date(searchForm.checkIn)) {
      alert("Check-out must be after check-in");
      return;
    }

    const typedCity = searchForm.city.trim();
    const matchedCity = cities.find(
      (city) => city.toLowerCase() === typedCity.toLowerCase(),
    );

    setLoading(true);
    setSearchPerformed(true);
    setGuestOpen(false);

    try {
      const { data } = await api.get("/rooms", {
        params: {
          ...(matchedCity ? { city: matchedCity } : { search: typedCity }),
          checkIn: searchForm.checkIn,
          checkOut: searchForm.checkOut,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        },
      });

      setRooms(markSomeRoomsUnavailable(data));
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          resultsSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      });
    }
  };

  const handleTrendingClick = async (cityName) => {
    setSearchForm({
      city: cityName,
      checkIn: "",
      checkOut: "",
    });
    setDateRange([null, null]);
    setGuestOpen(false);
    setDateOpen(false);
    setLoading(true);
    setSearchPerformed(true);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resultsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    try {
      const { data } = await api.get("/rooms", {
        params: { city: cityName },
      });

      setRooms(markSomeRoomsUnavailable(data));
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (collection) => {
    // Auto-fill based on collection
    const searches = {
      "Couple Retreats": "Bengaluru",
      "Luxury Stays": "Bengaluru",
      "Nightlife Stays": "Bengaluru",
      "Nature Retreat": "Bengaluru",
      "Lush Pools": "Hyderabad",
    };

    setSearchForm({
      ...searchForm,
      city: searches[collection.title] || "Bengaluru",
    });
  };

  const handleRoomClick = (room) => {
    navigate(`/hotel/${room.id}`, {
      state: {
        room,
        checkIn: searchForm.checkIn,
        checkOut: searchForm.checkOut,
      },
    });
  };

  const getRoomRating = (room) => {
    const base = room.type === "AC" ? 4 : 3;
    if (room.price >= 5500) return 5;
    if (room.price >= 4200) return Math.max(base, 4);
    return base;
  };

  const visibleRooms = useMemo(() => {
    const selectedAmenities = filters.amenities || [];
    const selectedRatings = filters.ratings || [];

    return rooms.filter((room) => {
      if (selectedAmenities.includes("ac") && room.type !== "AC") {
        return false;
      }

      if (selectedRatings.length) {
        const roomRating = getRoomRating(room);
        if (!selectedRatings.includes(roomRating)) {
          return false;
        }
      }

      return true;
    });
  }, [filters.amenities, filters.ratings, rooms]);

  const [startDate, endDate] = dateRange;

  const dateLabel = useMemo(() => {
    if (!startDate && !endDate) return "Add dates";
    if (startDate && !endDate) {
      return startDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    }
    return `${startDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })} - ${endDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })}`;
  }, [startDate, endDate]);

  return (
    <div className="home-page">
      {/* Search Section */}
      <section className="search-section">
        <h1>Find Your Perfect Stay</h1>

        <div className="search-card">
          <div className="search-field">
            <label>Select City</label>
            <input
              list="cities-list"
              value={searchForm.city}
              onChange={(e) =>
                setSearchForm({ ...searchForm, city: e.target.value })
              }
              placeholder="Enter city"
            />
            <datalist id="cities-list">
              {cities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>

          <div className="search-field date-field" ref={dateDropdownRef}>
            <label>When</label>
            <button
              type="button"
              className="date-trigger"
              onClick={() => setDateOpen((prev) => !prev)}
            >
              {dateLabel}
            </button>
            {dateOpen && (
              <div className="date-dropdown">
                <DatePicker
                  inline
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  onChange={(update) => {
                    setDateRange(update);
                    const [start, end] = update;
                    setSearchForm((prev) => ({
                      ...prev,
                      checkIn: start ? start.toISOString().split("T")[0] : "",
                      checkOut: end ? end.toISOString().split("T")[0] : "",
                    }));
                  }}
                />
              </div>
            )}
          </div>

          <div className="search-field guest-field" ref={guestDropdownRef}>
            <label>Rooms & Passengers</label>
            <button
              type="button"
              className="guest-trigger"
              onClick={() => setGuestOpen((prev) => !prev)}
            >
              {passengerSummary}
            </button>

            {guestOpen && (
              <div className="guest-dropdown">
                <MemberSelector
                  roomGroups={roomGroups}
                  setRoomGroups={setRoomGroups}
                />
              </div>
            )}
          </div>

          <button
            className="search-button"
            onClick={handleSearch}
            type="button"
          >
            Search
          </button>
        </div>
      </section>

      {/* Room List + Left Filters - Above Trending */}
      {searchPerformed && (
        <section className="results-wrap" ref={resultsSectionRef}>
          <aside className="filters-column">
            <Filters filters={filters} setFilters={setFilters} />
          </aside>

          <div className="rooms-column">
            <section className="rooms-section">
              <h2>
                {searchForm.city
                  ? `Hotels in ${searchForm.city}`
                  : visibleRooms.length > 0
                    ? "Available Rooms"
                    : "No Rooms Found"}
              </h2>

              {visibleRooms.length === 0 && !loading && (
                <p className="no-rooms-note">
                  No hotels found for this city/date. Try another city like
                  Bengaluru, Hyderabad, Chennai, Mumbai, Pune, or Delhi.
                </p>
              )}

              <div className="room-grid">
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <RoomSkeleton key={index} />
                    ))
                  : visibleRooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => handleRoomClick(room)}
                        style={{ cursor: "pointer" }}
                      >
                        <RoomCard
                          room={room}
                          onBookClick={handleRoomClick}
                          isFavorite={favorites.includes(room.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      </div>
                    ))}
              </div>
            </section>
          </div>
        </section>
      )}

      {/* Trending Destinations */}
      <section className="trending-section">
        <div className="section-header">
          <h2>Trending Destinations</h2>
          <p className="section-subtitle">
            Popular places for your next getaway
          </p>
        </div>

        <div className="trending-grid">
          {trendingDestinations.map((destination) => (
            <div
              key={destination.id}
              className="trending-card"
              onClick={() => handleTrendingClick(destination.name)}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTrendingClick(destination.name);
              }}
            >
              <img src={destination.image} alt={destination.name} />
              <h3>
                {destination.name} {destination.flag}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="collections-section">
        <div className="section-header">
          <h2>Collections</h2>
          <p className="section-subtitle">Explore curated stays by theme</p>
        </div>

        <div className="collections-scroll">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="collection-card"
              onClick={() => handleCollectionClick(collection)}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCollectionClick(collection);
              }}
            >
              <img src={collection.image} alt={collection.title} />
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <Reviews />

      <NearbyMap city={searchForm.city || "Bengaluru"} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
