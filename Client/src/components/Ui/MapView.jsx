import { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Helper component to change view
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 6);
  }, [center, map]);
  return null;
};

const MapView = ({ locations, startLocation }) => {
  const mapRef = useRef(null);

  const center = [startLocation.coordinates[1], startLocation.coordinates[0]];

  return (
    <div>
      <MapContainer
        center={center}
        zoom={6}
        whenCreated={(map) => (mapRef.current = map)}
        style={{ height: "100vh", width: "100vw" }}
      >
        <ChangeMapView center={center} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={[loc.coordinates[1], loc.coordinates[0]]}
          >
            <Popup>
              Day {loc.day} {loc.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
