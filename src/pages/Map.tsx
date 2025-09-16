import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../lib/supabase";

// Fix default marker issue in Leaflet
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Lake = {
  id: string;
  name: string;
  description: string;
  fish_types: string[];
  best_baits: string[];
  lat: number;
  lng: number;
};

const MapPage: React.FC = () => {
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLakes = async () => {
      const { data, error } = await supabase.from("lakes").select("*");
      if (error) {
        console.error("Error fetching lakes:", error);
      } else {
        setLakes(data || []);
      }
      setLoading(false);
    };
    fetchLakes();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading map...</div>;
  }

  return (
    <div className="h-screen w-full">
      <MapContainer center={[42.7339, 25.4858]} zoom={7} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {lakes.map((lake) => (
          <Marker key={lake.id} position={[lake.lat, lake.lng]}>
            <Popup>
              <h2 className="font-bold">{lake.name}</h2>
              <p className="text-sm">{lake.description}</p>
              <p className="text-xs mt-2">
                🎣 <b>Риби:</b> {lake.fish_types?.join(", ")}
              </p>
              <p className="text-xs">
                🪱 <b>Примамки:</b> {lake.best_baits?.join(", ")}
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;