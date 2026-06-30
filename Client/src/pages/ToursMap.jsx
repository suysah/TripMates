import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import { FaLocationArrow, FaSearchLocation, FaSlidersH, FaCompass } from "react-icons/fa";

// Component to dynamically pan/zoom map view
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 5);
    }
  }, [center, map]);
  return null;
};

// Component to capture map clicks and update search coordinates
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const ToursMap = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Search parameters states
  const [searchCenter, setSearchCenter] = useState([34.0522, -118.2437]); // Default Los Angeles
  const [radius, setRadius] = useState(250); // Default radius
  const [unit, setUnit] = useState("mi"); // Default unit
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch tours within distance
  const searchTours = async (lat, lng, rad, u) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const latlng = `${lat},${lng}`;
      const url = `${BASE_URL}/api/v1/tours/tours-within/${rad}/center/${latlng}/unit/${u}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setTours(data.data || []);
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error("Geospatial search error", err);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  // Perform search when center, radius or unit changes
  useEffect(() => {
    if (searchCenter) {
      searchTours(searchCenter[0], searchCenter[1], radius, unit);
    }
  }, [searchCenter, radius, unit]);

  // Attempt user Geolocation
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCenter = [position.coords.latitude, position.coords.longitude];
          setSearchCenter(userCenter);
        },
        (error) => {
          console.warn("Geolocation access denied or failed.");
          // keep default
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col lg:flex-row min-h-0 relative">
        {/* Floating Controller Panel (left side overlay or sidebar) */}
        <div className="w-full lg:w-96 bg-white shadow-xl border-r z-20 flex flex-col max-h-[400px] lg:max-h-none overflow-y-auto">
          <div className="p-6 border-b bg-teal-50">
            <h2 className="text-xl font-bold text-teal-900 flex items-center gap-2">
              <FaSearchLocation className="text-teal-700" /> Geospatial Explorer
            </h2>
            <p className="text-gray-600 text-xs mt-1">
              Find travel itineraries around specific locations on the globe.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Geolocation Button */}
            <button
              onClick={handleGeolocation}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow transition-all duration-200"
            >
              <FaLocationArrow className="w-3.5 h-3.5" /> Search Near Me
            </button>

            {/* Radius Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span className="flex items-center gap-1"><FaSlidersH className="text-teal-600" /> Radius</span>
                <span>{radius} {unit === "mi" ? "miles" : "km"}</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Units selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Distance Unit</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUnit("mi")}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                    unit === "mi"
                      ? "bg-teal-700 text-white border-teal-700 shadow"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Miles (mi)
                </button>
                <button
                  onClick={() => setUnit("km")}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                    unit === "km"
                      ? "bg-teal-700 text-white border-teal-700 shadow"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Kilometers (km)
                </button>
              </div>
            </div>

            {/* Click Help */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
              💡 **Map Navigation**: Click anywhere on the map to set a new search center and discover tours in that zone.
            </div>
          </div>

          {/* Results Summary */}
          <div className="border-t flex-grow p-6 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <FaCompass className="text-teal-600" /> Results ({tours.length})
            </h3>

            {loading ? (
              <div className="py-10 flex justify-center"><Spinner /></div>
            ) : tours.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs italic">
                {hasSearched
                  ? "No tours found in this radius. Try increasing the search distance."
                  : "Click on the map to query tours."}
              </div>
            ) : (
              <div className="space-y-3">
                {tours.map((t) => (
                  <div
                    key={t.id || t._id}
                    className="p-3 bg-white hover:bg-teal-50/50 border rounded-xl shadow-sm transition-all cursor-pointer flex gap-3"
                    onClick={() => {
                      if (t.startLocation?.coordinates) {
                        setSearchCenter([t.startLocation.coordinates[1], t.startLocation.coordinates[0]]);
                      }
                    }}
                  >
                    <img
                      src={`${BASE_URL}/public/img/tours/${t.imageCover}`}
                      alt={t.name}
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{t.name}</h4>
                      <p className="text-[10px] text-gray-500 truncate">{t.startLocation.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-teal-700 font-bold text-[10px]">${t.price}</span>
                        <Link
                          to={`/details/${t.id || t._id}`}
                          className="text-[9px] font-bold text-teal-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Details &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full-screen interactive Map component */}
        <div className="flex-grow h-[450px] lg:h-auto z-10 relative">
          <MapContainer
            center={searchCenter}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-full-container"
          >
            <ChangeMapView center={searchCenter} />
            <MapClickHandler onMapClick={setSearchCenter} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Highlighted Search Circle */}
            {searchCenter && (
              <Circle
                center={searchCenter}
                radius={unit === "mi" ? radius * 1609.34 : radius * 1000}
                pathOptions={{
                  fillColor: "#0d9488",
                  fillOpacity: 0.08,
                  color: "#0d9488",
                  weight: 1.5,
                  dashArray: "5, 5",
                }}
              />
            )}

            {/* Search Center Marker (Blue Dot) */}
            {searchCenter && (
              <Marker position={searchCenter}>
                <Popup>
                  <div className="text-center font-bold text-teal-800 text-xs">
                    Search Center Pin
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Found Tour Pins */}
            {tours.map((t) => {
              if (!t.startLocation || !t.startLocation.coordinates) return null;
              const position = [t.startLocation.coordinates[1], t.startLocation.coordinates[0]];
              return (
                <Marker key={t.id || t._id} position={position}>
                  <Popup className="tour-map-popup">
                    <div className="p-1 max-w-[200px]">
                      <img
                        src={`${BASE_URL}/public/img/tours/${t.imageCover}`}
                        alt={t.name}
                        className="w-full h-24 object-cover rounded-lg border mb-2"
                      />
                      <h4 className="font-bold text-xs text-teal-900 leading-tight">{t.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                        {t.duration} Days | {t.difficulty}
                      </p>
                      <div className="flex justify-between items-center mt-2 border-t pt-2">
                        <span className="text-teal-700 font-bold text-xs">${t.price}</span>
                        <Link
                          to={`/details/${t.id || t._id}`}
                          className="px-2 py-1 bg-teal-800 text-white rounded text-[10px] font-bold shadow hover:bg-teal-900 transition-colors"
                        >
                          View Tour
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ToursMap;
