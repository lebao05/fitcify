import { NavLink } from "react-router-dom";

const filters = ["songs", "albums", "artists", "playlists"];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function FilterBar() {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {filters.map((filter) => (
        <NavLink
          key={filter}
          to={`/search/${filter}`}
          className={({ isActive }) =>
            `px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-white text-black"
                : "bg-[#242424] text-white hover:bg-[#2a2a2a]"
            }`
          }
        >
          {capitalize(filter)}
        </NavLink>
      ))}
    </div>
  );
}
