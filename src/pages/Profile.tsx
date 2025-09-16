import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthGate";

interface Profile {
  id: string;
  username: string | null;
  profile_pic: string | null;
  rank: string | null;
  badges: string[] | null;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // Load profile on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        console.error("Error loading profile:", error.message);
        return;
      }
      if (data) {
        setProfile(data as Profile);
        setUsernameInput(data.username ?? "");
      }
    })();
  }, [user]);

  // Upload avatar
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !profile) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const filePath = `avatars/${user.id}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data?.publicUrl ?? null;
      await supabase
        .from("profiles")
        .update({ profile_pic: avatarUrl })
        .eq("id", user.id);
      setProfile({ ...profile, profile_pic: avatarUrl });
    }
    setUploading(false);
  };

  // Save username
  const handleSaveName = async () => {
    if (!user || !profile) return;
    const { error } = await supabase
      .from("profiles")
      .update({ username: usernameInput })
      .eq("id", user.id);
    if (error) {
      console.error("Error saving username:", error.message);
    } else {
      setProfile({ ...profile, username: usernameInput });
      alert("Потребителското име е запазено успешно!");
    }
  };

  if (!profile) {
    return <div className="p-6 text-center">Зареждане на профила…</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-ocean-900/70 border border-white/10 rounded-xl">
      {/* Avatar + username */}
      <div className="flex flex-col items-center mb-4">
        {profile.profile_pic ? (
          <img
            src={profile.profile_pic}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-ocean-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-white">
            No Pic
          </div>
        )}
        {profile.username && (
          <h2 className="mt-2 text-xl font-semibold">{profile.username}</h2>
        )}
      </div>

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={handleFileChange}
        className="mb-4 w-full"
      />

      {/* Username edit */}
      <label className="block mb-1 text-sm">Потребителско име</label>
      <input
        type="text"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
        className="w-full p-2 mb-2 rounded text-black"
        placeholder="Въведи ново потребителско име"
      />
      <button
        onClick={handleSaveName}
        className="w-full py-2 rounded bg-ocean-500 hover:bg-ocean-600 transition text-white font-semibold"
      >
        Запази име
      </button>

      {/* Rank & Badges */}
      <div className="mt-6 text-white space-y-1">
        <p><strong>Ранг:</strong> {profile.rank ?? "Rookie Silver Fish"}</p>
        <p>
          <strong>Баджове:</strong>{" "}
          {profile.badges && profile.badges.length > 0
            ? profile.badges.join(", ")
            : "Няма"}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
