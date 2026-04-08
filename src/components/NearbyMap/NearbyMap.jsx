import "./NearbyMap.css";

function NearbyMap({ city = "Bengaluru" }) {
  const mapQuery = encodeURIComponent(`${city} hotels near me`);

  return (
    <section className="nearby-section">
      <div className="nearby-container">
        <h3>Nearby</h3>
        <iframe
          title="Nearby map"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}

export default NearbyMap;
