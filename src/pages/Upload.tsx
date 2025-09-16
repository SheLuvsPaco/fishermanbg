import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function UploadPage() {
  const [caption, setCaption] = useState("");
  const [lakeId, setLakeId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!photo || !lakeId) {
      setStatus("Моля, избери снимка и езеро.");
      return;
    }

    setStatus("Качване...");

    const fileName = `${Date.now()}-${photo.name}`;
    const { error: uploadError } = await supabase.storage
      .from("catches")
      .upload(fileName, photo);

    if (uploadError) {
      setStatus("Грешка при качване на снимката.");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("catches")
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("catches").insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        lake_id: lakeId,
        caption,
        photo_url: publicUrlData.publicUrl,
        points: 10,
      },
    ]);

    if (insertError) {
      setStatus("Грешка при запис в базата.");
      console.error(insertError);
    } else {
      setStatus("Успешно качено!");
      setCaption("");
      setLakeId("");
      setPhoto(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Качи улов</h1>

      <input
        type="text"
        placeholder="ID на езеро"
        value={lakeId}
        onChange={(e) => setLakeId(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded-xl text-black"
      />

      <textarea
        placeholder="Описание / коментар"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded-xl text-black"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-ocean-500 text-white font-semibold rounded-xl py-3 hover:bg-ocean-600 transition"
      >
        Качи
      </button>

      {status && <p className="mt-3 text-white">{status}</p>}
    </div>
  );
}