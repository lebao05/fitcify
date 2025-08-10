import { albumsData } from "../../assets/assets";
import AlbumItem from "./AlbumItem";
import { songsData } from "../../assets/assets";
import SongItem from "./SongItem";
import ArtistItem from "./ArtistItem";
import ShortcutItem from "./ShortcutItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchTopSongs,
  fetchTopAlbums,
  fetchTopArtists,
} from "../../redux/slices/myCollectionSlice";
import ScrollableTrackList from "./ScrollableTrackList.jsx";
// const shortcutItems = [
//   { id: 1, name: "Liked Songs", image: "/liked.jpg" },
//   { id: 2, name: "Hall of Fame", image: "/hall.jpg" },
//   { id: 3, name: "Nơi Này Có Anh Radio", image: "/noi-nay.jpg" },
//   { id: 4, name: "Daily Mix 4", image: "/mix4.jpg" },
//   { id: 5, name: "The Secret Power", image: "/secret.jpg" },
//   { id: 6, name: "Daily Mix 2", image: "/mix2.jpg" },
//   { id: 7, name: "m-tp M-TP", image: "/mtp.jpg" },
//   { id: 8, name: "Daily Mix 5", image: "/mix5.jpg" },
// ];

const DisplayHome = () => {
  const dispatch = useDispatch();
  const topSongs = useSelector((state) => state.myCollection.topSongs);
  const topAlbums = useSelector((state) => state.myCollection.topAlbums);
  const topArtists = useSelector((state) => state.myCollection.topArtists);
  const user = useSelector((state) => state.user.myAuth);

  useEffect(() => {
    dispatch(fetchTopSongs());
    dispatch(fetchTopAlbums());
    dispatch(fetchTopArtists());
  }, [dispatch]);

  return (
    <div className="px-4 sm:px-6 md:px-8">
      {/* {user && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-5 mb-6">
          {shortcutItems.map((item) => (
            <ShortcutItem
              key={item.id}
              name={item.name}
              image={item.image}
              onClick={() => console.log("Clicked:", item.name)}
            />
          ))}
        </div>
      )} */}

      {/* Trending Songs */}
      <section className="mb-8">
        <h1 className="my-5 font-bold text-2xl sm:text-3xl">Trending Songs</h1>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
          {" "}
          <ScrollableTrackList>
            {topSongs.map((item, index) => (
              <SongItem
                key={index}
                name={item.title}
                desc={""}
                id={item._id}
                image={item.imageUrl}
              />
            ))}{" "}
          </ScrollableTrackList>
        </div>
      </section>

      {/* Popular Artists */}
      <section className="mb-8">
        <h1 className="my-5 font-bold text-2xl sm:text-3xl">Popular Artists</h1>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
          <ScrollableTrackList>
            {topArtists.map((item, index) => (
              <ArtistItem
                key={index}
                name={item.name}
                desc={item.desc}
                id={item._id}
                image={item.imageUrl}
              />
            ))}
          </ScrollableTrackList>
        </div>
      </section>

      {/* Popular Albums */}
      <section className="mb-8">
        <h1 className="my-5 font-bold text-2xl sm:text-3xl">Popular Albums</h1>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
          {" "}
          <ScrollableTrackList>
            {topAlbums.map((item, index) => (
              <AlbumItem
                key={index}
                name={item.title}
                desc={item.desc}
                id={item._id}
                image={item.imageUrl}
              />
            ))}{" "}
          </ScrollableTrackList>
        </div>
      </section>
    </div>
  );
};

export default DisplayHome;
