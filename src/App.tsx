import { Routes, Route, Navigate } from "react-router-dom";
import WaterBackground from "./components/WaterBackground";
import NavBar from "./components/NavBar";
import AuthGate from "./components/AuthGate";

import Home from "./pages/Home";
import MapPage from "./pages/Map";
import ProfilePage from "./pages/Profile";
import UploadPage from "./pages/Upload";
import TournamentsPage from "./pages/Tournaments";
import OAuthCallback from "./pages/OAuthCallback";

export default function App() {
  return (
    <div className="min-h-dvh">
      <WaterBackground />
      <AuthGate>
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <NavBar />
      </AuthGate>
    </div>
  );
}