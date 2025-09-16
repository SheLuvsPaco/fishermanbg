import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "leaflet/dist/leaflet.css";

// Custom water drop icon
const waterDropIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2907/2907253.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface Lake {
  id: string;
  name: string;
  description: string;
  fish_types: string[];
  best_baits: string[];
  image_url: string;
  lat: number;
  lng: number;
}

export default function MapPage() {
  const [lakes, setLakes] = useState<Lake[]>([]);

  useEffect(() => {
    const fetchLakes = async () => {
      const { data, error } = await supabase.from("lakes").select("*");
      if (error) {
        console.error("Error fetching lakes:", error.message);
      } else {
        setLakes(data || []);
      }
    };
    fetchLakes();
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] w-full p-4">
      <MapContainer
        center={[42.7, 25.3]} // Center of Bulgaria
        zoom={7}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        maxBounds={[
          [41, 22], // Southwest corner
          [44.5, 29.5], // Northeast corner
        ]}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {lakes.map((lake) => (
          <Marker
            key={lake.id}
            position={[lake.lat, lake.lng]}
            icon={waterDropIcon}
          >
            <Popup>
              <div className="text-center">
                <h2 className="font-bold text-lg mb-2">{lake.name}</h2>
                {lake.image_url && (
                  <img
                    src={lake.image_url}
                    alt={lake.name}
                    className="w-48 h-32 object-cover rounded mb-2 mx-auto"
                  />
                )}
                <p className="text-sm">{lake.description}</p>
                <p className="text-xs mt-1">
                  🎣 <strong>Риби:</strong>{" "}
                  {lake.fish_types?.length > 0
                    ? lake.fish_types.join(", ")
                    : "Няма информация"}
                </p>
                <p className="text-xs">
                  🪱 <strong>Стръв:</strong>{" "}
                  {lake.best_baits?.length > 0
                    ? lake.best_baits.join(", ")
                    : "Няма информация"}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
