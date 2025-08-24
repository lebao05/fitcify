import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import ArtistItem from "./ArtistItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchTopSongs,
  fetchTopAlbums,
  fetchTopArtists,
} from "../../redux/slices/myCollectionSlice";
import ScrollableTrackList from "./ScrollableTrackList.jsx";

const DisplayHome = () => {
  const dispatch = useDispatch();
  const topSongs = useSelector((state) => state.myCollection.topSongs);
  const topAlbums = useSelector((state) => state.myCollection.topAlbums);
  const topArtists = useSelector((state) => state.myCollection.topArtists);

  useEffect(() => {
    dispatch(fetchTopSongs());
    dispatch(fetchTopAlbums());
    dispatch(fetchTopArtists());
  }, [dispatch]);

  return (
    <div className="px-4 sm:px-6 md:px-8">
      {/* Popular Albums */}
      <section className="mb-8">
        <h1 className="my-5 font-bold text-2xl sm:text-3xl">Popular Albums</h1>
        <ScrollableTrackList>
          {topAlbums.map((item, index) => (
            <AlbumItem
              key={index}
              name={item.title}
              desc={item.desc}
              id={item._id}
              image={item.imageUrl}
            />
          ))}
        </ScrollableTrackList>
      </section>
      {/* Popular Artists */}
      <section className="mb-8">
        <h1 className="my-5 font-bold text-2xl sm:text-3xl">Popular Artists</h1>
        <ScrollableTrackList>
          {topArtists.map((item, index) => (
            <ArtistItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item.userId}
              image={item.imageUrl}
            />
          ))}
        </ScrollableTrackList>
      </section>

      <section className="mb-8">
        <h1 className="my-5 font-bold text-2xl sm:text-3xl">Trending Songs</h1>
        <ScrollableTrackList>
          {topSongs.map((item, index) => (
            <SongItem
              key={index}
              name={item.title}
              desc={""}
              id={item._id}
              image={item.imageUrl}
            />
          ))}
        </ScrollableTrackList>
      </section>
    </div>
  );
};

export default DisplayHome;
