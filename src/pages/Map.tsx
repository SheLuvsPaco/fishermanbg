import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "leaflet/dist/leaflet.css";

// Custom water drop icon
const waterDropIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // stable water drop
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
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
        console.error("Error fetching lakes:", error);
      } else {
        setLakes(data || []);
      }
    };
    fetchLakes();
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] w-full">
      <MapContainer
        center={[42.7, 25.3]} // Center on Bulgaria
        zoom={7}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        maxBounds={[
          [41, 22],
          [44.5, 29.5],
        ]}
      >
        {/* Nature-style topo map */}
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a>'
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
                    : "Няма"}
                </p>
                <p className="text-xs">
                  🪱 <strong>Стръв:</strong>{" "}
                  {lake.best_baits?.length > 0
                    ? lake.best_baits.join(", ")
                    : "Няма"}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
