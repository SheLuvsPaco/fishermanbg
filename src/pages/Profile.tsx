import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthGate";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [rank, setRank] = useState("Rookie Silver Fish");
  const [badges, setBadges] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Load profile data on login
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, profile_pic, rank, badges")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile load error:", error.message);
        return;
      }

      if (data) {
        setUsername(data.username || "");
        setProfilePic(data.profile_pic);
        setRank(data.rank || "Rookie Silver Fish");
        setBadges(data.badges || []);
      } else {
        // Create new row if it doesn’t exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, username: "", rank: "Rookie Silver Fish", badges: [] }]);

        if (insertError) {
          console.error("Error creating profile:", insertError.message);
        }
      }
    };
    loadProfile();
  }, [user]);

  // Upload profile picture
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!user) return;
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const filePath = `avatars/${user.id}-${Date.now()}-${file.name}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Save to profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_pic: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfilePic(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Save username
  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving username:", error.message);
    } else {
      alert("Потребителското име е запазено успешно!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Моят профил</h1>

      <div className="mb-4">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
            No Pic
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="mb-4"
      />

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Потребителско име"
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Запази име
      </button>

      <div className="mt-4 text-left">
        <p>
          <strong>Ранг:</strong> {rank}
        </p>
        <p>
          <strong>Баджове:</strong>{" "}
          {badges && badges.length > 0 ? badges.join(", ") : "Няма"}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;