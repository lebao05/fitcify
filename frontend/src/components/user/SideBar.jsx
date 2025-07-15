import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import PlayplistBar from "./PlayplistBar.jsx";
import ArtistBar from "./ArtistBar.jsx";
import AlbumBar from "./AlbumBar.jsx";
import LikedTrackBar from "./LikedTrackBar.jsx";

const likedItem = {
  cover: assets.liked_icon,
  title: "Liked Songs",
  subtitle: "Playlist • 108 songs",
};

const mockLibrary = [
  {
    id: 1,
    type: "playlist",
    title: "Liked Songs",
    subtitle: "Playlist • 108 songs",
    cover: assets.liked_icon,
  },
  {
    id: 2,
    type: "album",
    title: "m-tp M-TP",
    artist: "Sơn Tùng M‑TP",
    cover: "https://placehold.co/64x64",
  },
  {
    id: 3,
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  {
    id: 4,
    type: "artist",
    name: "SOOBIN",
    avatar: "https://link-to-artist-avatar.jpg",
  },
  {
    id: 5,
    type: "artist",
    name: "Sơn Tùng M‑TP",
    avatar:
      "https://pm1.narvii.com/6377/305a5e5165217c3b232c973a53bd1e057aea6855_hq.jpg",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[25%] mt-14 min-w-[250px] h-full flex flex-col p-2 gap-2 text-white bg-black">
      {/* Top Nav Section */}

      {/* Library Section */}
      <div className="bg-[#121212] flex-1 rounded flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="stack_icon" />
            <p className="font-semibold">Your Library</p>
          </div>
          <img className="w-5 cursor-pointer" src={assets.plus_icon} alt="plus_icon" />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-1 scroll-on-hover">
          <LikedTrackBar
            cover={likedItem.cover}
            title={likedItem.title}
            subtitle={likedItem.subtitle}
            onClick={() => console.log("Liked Songs clicked")}
          />
          {mockLibrary.map((item) => {
            if (item.type === "playlist") {
              return (
                <PlayplistBar
                  key={item.id}
                  cover={item.cover}
                  title={item.title}
                  subtitle={item.subtitle}
                  onClick={() => console.log("Playlist clicked", item.title)}
                />
              );
            } else if (item.type === "artist") {
              return (
                <ArtistBar
                  key={item.id}
                  avatar={item.avatar}
                  name={item.name}
                  onClick={() => console.log("Artist clicked", item.name)}
                />
              );
            } else if (item.type === "album") {
              return (
                <AlbumBar
                  key={item.id}
                  cover={item.cover}
                  title={item.title}
                  artist={item.artist}
                  onClick={() => console.log("Album clicked", item.title)}
                />
              );
            } else return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
