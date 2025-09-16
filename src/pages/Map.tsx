import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "leaflet/dist/leaflet.css";

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
      if (error) console.error(error);
      else setLakes(data || []);
    };
    fetchLakes();
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] w-full">
  <MapContainer
    center={[42.7, 25.3]}
    zoom={7}
    style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    maxBounds={[
      [41, 22],
      [44.5, 29.5],
    ]}
  >
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    />
  </MapContainer>
</div>
          >
            <Popup>
              <div className="text-center">
                <h2 className="font-bold text-lg mb-2">{lake.name}</h2>
                <img
                  src={lake.image_url}
                  alt={lake.name}
                  className="w-48 h-32 object-cover rounded mb-2"
                />
                <p className="text-sm">{lake.description}</p>
                <p className="text-xs mt-1">
                  🎣 <strong>Риби:</strong> {lake.fish_types.join(", ")}
                </p>
                <p className="text-xs">
                  🪱 <strong>Стръв:</strong> {lake.best_baits.join(", ")}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
