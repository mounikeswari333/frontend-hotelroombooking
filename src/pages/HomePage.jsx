import RoomCard from "../components/RoomCard";
import RoomSkeleton from "../components/RoomSkeleton";

function HomePage({ rooms, loading, filters, setFilters }) {
  const handleFilter = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="page">
      <section className="hero">
        <h1>Over 174,000+ hotels and homes across 35+ countries</h1>
        <p>Book rooms with instant availability checks and clean pricing.</p>
      </section>

      <section className="card filter-card">
        <h2>Filter Rooms</h2>
        <div className="filters">
          <label>
            Type
            <select name="type" value={filters.type} onChange={handleFilter}>
              <option value="All">All</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </label>

          <label>
            Min Price
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilter}
              min="0"
            />
          </label>

          <label>
            Max Price
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilter}
              min="0"
            />
          </label>
        </div>
      </section>

      <section className="room-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <RoomSkeleton key={index} />
            ))
          : rooms.map((room) => <RoomCard key={room.id} room={room} />)}
      </section>

      {!loading && rooms.length === 0 && (
        <p className="empty-state">No rooms found for the selected filters.</p>
      )}
    </main>
  );
}

export default HomePage;
