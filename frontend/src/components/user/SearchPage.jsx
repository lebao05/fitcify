import { Routes, Route, Navigate } from "react-router-dom";
import FilterBar from "./FilterBar";
import SongSearchResult from "./SongSearchResult";
import AlbumSearchResult from "./AlbumSearchResult";
import ArtistSearchResult from "./ArtistSearchResult";
import PlaylistSearchResult from "./PlaylistSearchResult";
import ProfileSearchResult from "./ProfileSearchResult";

export default function SearchPage() {
  return (
    <div className="text-white px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <FilterBar />

      <Routes>
        <Route path="/" element={<Navigate to="songs" />} />
        <Route path="albums" element={<AlbumSearchResult />} />
        <Route path="songs" element={<SongSearchResult />} />
        <Route path="artists" element={<ArtistSearchResult />} />
        <Route path="playlists" element={<PlaylistSearchResult />} />
        <Route path="profiles" element={<ProfileSearchResult />} />
      </Routes>
    </div>
  );
}
