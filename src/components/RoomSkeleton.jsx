function RoomSkeleton() {
  return (
    <div className="room-card skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="room-content">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-button" />
      </div>
    </div>
  );
}

export default RoomSkeleton;
