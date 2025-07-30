import { albumsData } from "../../assets/assets";
import AlbumItem from "./AlbumItem";
import { songsData } from "../../assets/assets";
import SongItem from "./SongItem";
import ArtistItem from "./ArtistItem";
import ShortcutGrid from "./ShortcutGrid";
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
          {songsData.map((item, index) => (
            <SongItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item.id}
              image={item.image}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
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
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Popular artist</h1>
        <div className="flex overflow-auto">
          {songsData.map((item, index) => (
            <ArtistItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item.id}
              image={item.image}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Popular albums</h1>
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
