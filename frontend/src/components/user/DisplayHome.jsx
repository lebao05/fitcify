import { albumsData } from "../../assets/assets";
import AlbumItem from "./AlbumItem";
import { songsData } from "../../assets/assets";
import SongItem from "./SongItem";
import ArtistItem from "./ArtistItem";
import ShortcutGrid from "./ShortcutGrid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchTopSongs,
  fetchTopAlbums,
  fetchTopArtists,
} from "../../redux/slices/myCollectionSlice";
const shortcutItems = [
  { id: 1, name: "Liked Songs", image: "/liked.jpg" },
  { id: 2, name: "Hall of Fame", image: "/hall.jpg" },
  { id: 3, name: "Nơi Này Có Anh Radio", image: "/noi-nay.jpg" },
  { id: 4, name: "Daily Mix 4", image: "/mix4.jpg" },
  { id: 5, name: "The Secret Power", image: "/secret.jpg" },
  { id: 6, name: "Daily Mix 2", image: "/mix2.jpg" },
  { id: 7, name: "m-tp M-TP", image: "/mtp.jpg" },
  { id: 8, name: "Daily Mix 5", image: "/mix5.jpg" },
];
const DisplayHome = () => {
  const dispatch = useDispatch();
  const topSongs = useSelector((state) => state.myCollection.topSongs);
  const topAlbums = useSelector((state) => state.myCollection.topAlbums);
  const topArtists = useSelector((state) => state.myCollection.topArtists);
  useEffect(() => {
    // Fetch top songs, albums, and artists when the component mounts
    dispatch(fetchTopSongs());
    dispatch(fetchTopAlbums());
    dispatch(fetchTopArtists());
    console.log("Top Songs:", topSongs);
    console.log("Top Albums:", topAlbums);
    console.log("Top Artists:", topArtists);
  }, [dispatch]);
  return (
    <div className="px-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 mb-6">
        {shortcutItems.map((item) => (
          <ShortcutGrid
            key={item.id}
            name={item.name}
            image={item.image}
            onClick={() => console.log("Clicked:", item.name)}
          />
        ))}
      </div>

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Trending Songs</h1>
        <div className="flex overflow-auto">
          {topSongs.map((item, index) => (
            <SongItem
              key={item.index}
              name={item.title}
              desc={""}
              id={item._id}
              image={item.imageUrl}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div className="flex overflow-auto">
          {topAlbums.map((item, index) => (
            <AlbumItem
              key={index}
              name={item.title}
              desc={item.desc}
              id={item._id}
              image={item.imageUrl}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Popular artist</h1>
        <div className="flex overflow-auto">
          {topArtists.map((item, index) => (
            <ArtistItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item._id}
              image={item.imageUrl}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Popular albums</h1>
        <div className="flex overflow-auto">
          {topAlbums.map((item, index) => (
            <AlbumItem
              key={index}
              name={item.title}
              desc={item.desc}
              id={item._id}
              image={item.imageUrl}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Top mixes</h1>
        <div className="flex overflow-auto">
          {albumsData.map((item, index) => (
            <AlbumItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item.id}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayHome;
