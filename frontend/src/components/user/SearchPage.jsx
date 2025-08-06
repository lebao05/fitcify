import { Routes, Route, Navigate } from "react-router-dom";
import FilterBar from "./FilterBar";
import SongSearchResult from "./SongSearchResult";
import AlbumSearchResult from "./AlbumSearchResult";
import ArtistSearchResult from "./ArtistSearchResult";
import PlaylistSearchResult from "./PlaylistSearchResult";
import ProfileSearchResult from "./ProfileSearchResult";
import AllSearchResult from "./AllSearchResult";
import { useSearchParams } from "react-router-dom";
import { searchAll } from "../../services/musicApi";
import { useEffect, useState } from "react";
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [searchResult, setSearchResult] = useState(null);
  useEffect(() => {
    if (!query) return;
    const fetchSearchResult = async () => {
      try {
        const res = await searchAll(query);
        setSearchResult(res.Data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    fetchSearchResult();
  }, [query]);
  return (
    <div className="text-white px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <FilterBar />
      <Routes>
        <Route index element={<Navigate to="all" replace />} />
        <Route
          path="/all"
          element={<AllSearchResult searchResult={searchResult} />}
        />
        <Route
          path="albums"
          element={<AlbumSearchResult searchResult={searchResult} />}
        />
        <Route
          path="songs"
          element={<SongSearchResult searchResult={searchResult} />}
        />
        <Route
          path="artists"
          element={<ArtistSearchResult searchResult={searchResult} />}
        />
        <Route
          path="playlists"
          element={<PlaylistSearchResult searchResult={searchResult} />}
        />
        <Route
          path="profiles"
          element={<ProfileSearchResult searchResult={searchResult} />}
        />
      </Routes>
    </div>
  );
}
