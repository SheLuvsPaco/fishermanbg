import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Lake {
  id: string;
  name: string;
}

export default function UploadCatch() {
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [lakeId, setLakeId] = useState("");
  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");
  const [fishType, setFishType] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Load lakes from Supabase
  useEffect(() => {
    const fetchLakes = async () => {
      const { data, error } = await supabase.from("lakes").select("id, name");
      if (error) console.error(error);
      else setLakes(data || []);
    };
    fetchLakes();
  }, []);

  // Upload catch
  const handleUpload = async () => {
    if (!lakeId || !fishType || !weight || !file) {
      alert("Моля попълнете всички полета!");
      return;
    }

    try {
      setUploading(true);
      const filePath = `catches/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("catches")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("catches").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: insertError } = await supabase.from("catches").insert([
        {
          lake_id: lakeId,
          description,
          fish_type: fishType,
          weight,
          image_url: publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert("Уловът е качен успешно! 🎣");
      setLakeId("");
      setFishType("");
      setWeight("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Качи улов
      </h1>

      {/* Searchable lake dropdown */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Избери езеро</label>
        <input
          type="text"
          placeholder="Търси езеро..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <div className="max-h-32 overflow-y-auto border rounded">
          {lakes
            .filter((lake) =>
              lake.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((lake) => (
              <div
                key={lake.id}
                onClick={() => {
                  setLakeId(lake.id);
                  setSearch(lake.name);
                }}
                className={`p-2 cursor-pointer hover:bg-blue-100 ${
                  lakeId === lake.id ? "bg-blue-200" : ""
                }`}
              >
                {lake.name}
              </div>
            ))}
        </div>
      </div>

      {/* Fish type */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Вид риба</label>
        <input
          type="text"
          value={fishType}
          onChange={(e) => setFishType(e.target.value)}
          placeholder="Пример: Шаран, Пъстърва..."
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Weight */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Тегло (кг)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          placeholder="Например: 2.5"
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Описание / коментар</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опиши улова..."
          className="border rounded p-2 w-full"
        />
      </div>

      {/* File upload */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {uploading ? "Качване..." : "Качи"}
      </button>
    </div>
  );
}
