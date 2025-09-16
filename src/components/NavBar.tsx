import { NavLink } from "react-router-dom";

const linkClass =
  "flex-1 text-center py-3 text-sm md:text-base hover:bg-ocean-800/60 transition rounded-xl mx-1";

export default function NavBar() {
  return (
    <nav className="fixed bottom-3 left-0 right-0 mx-3 md:mx-auto md:max-w-xl bg-ocean-900/70 backdrop-blur border border-white/10 rounded-2xl p-1">
      <div className="flex">
        <NavLink to="/" className={linkClass}>Начало</NavLink>
        <NavLink to="/map" className={linkClass}>Езера</NavLink>
        <NavLink to="/upload" className={linkClass}>Улов</NavLink>
        <NavLink to="/tournaments" className={linkClass}>Турнири</NavLink>
        <NavLink to="/profile" className={linkClass}>Профил</NavLink>
      </div>
    </nav>
  );
}