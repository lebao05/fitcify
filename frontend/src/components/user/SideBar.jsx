import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import PlayplistBar from "./PlayplistBar.jsx";
import ArtistBar from "./ArtistBar.jsx";
import AlbumBar from "./AlbumBar.jsx";
import LikedTrackBar from "./LikedTrackBar.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserPlaylists } from "../../redux/slices/myCollectionSlice.js";
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
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  {
    id: 5,
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  {
    id: 6,
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  ,
  {
    id: 7,
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  {
    id: 8,
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  {
    id: 9,
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  {
    id: 10,
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  {
    id: 11,
    type: "playlist",
    title: "My Playlist #9",
    subtitle: "Playlist • Giabaoap",
    cover: "",
  },
  {
    id: 12,
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
  {
    id: 1,
    type: "artist",
    name: "SOOBIN",
    avatar: "https://link-to-artist-avatar.jpg",
  },
  {
    id: 2,
    type: "artist",
    name: "Sơn Tùng M‑TP",
    avatar:
      "https://pm1.narvii.com/6377/305a5e5165217c3b232c973a53bd1e057aea6855_hq.jpg",
  },
  {
    id: 3,
    type: "artist",
    name: "SOOBIN",
    avatar: "https://link-to-artist-avatar.jpg",
  },
  {
    id: 4,
    type: "artist",
    name: "Sơn Tùng M‑TP",
    avatar:
      "https://pm1.narvii.com/6377/305a5e5165217c3b232c973a53bd1e057aea6855_hq.jpg",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  const playlist = useSelector((state) => state.myCollection.playlists);
  const user = useSelector((state) => state.user.myAuth);
  useEffect(() => {
    if (user) {
      dispatch(fetchUserPlaylists());
    }
  }, [user, dispatch]);
  return (
    <div className="w-[20%] mt-14 min-w-[250px] h-full flex flex-col p-2 gap-2 text-white bg-black">
      {/* Top Nav Section */}

      {/* Library Section */}
      <div className="bg-[#121212] flex-1 rounded flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="stack_icon" />
            <p className="font-semibold">Your Library</p>
          </div>
          <img
            className="cursor-pointer rounded-full hover:bg-[#282828] w-8 h-8 p-1"
            src={assets.plus_icon}
            alt="Create Playlist"
          />
        </div>
        {/* <div className="flex-1 overflow-y-auto pr-2 space-y-1 scroll-on-hover pb-32">
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
        </div> */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-1 scroll-on-hover pb-32">
          <LikedTrackBar
            cover={likedItem.cover}
            title={likedItem.title}
            subtitle={likedItem.subtitle}
            onClick={() => console.log("Liked Songs clicked")}
          />
          {playlist?.map((item) => (
            <PlayplistBar
              key={item._id}
              cover={item.imageUrl || assets.music_placeholder}
              title={item.name}
              subtitle={`Playlist • ${item.owner?.name || "You"}`}
              onClick={() => navigate(`/playlist/${item._id}`)}
            />
          ))}
          {user?.followees &&
            user.followees.map((item) => (
              <ArtistBar
                key={item._id}
                avatar={item.avatarUrl}
                name={item.username}
                onClick={() => console.log("Playlist clicked", item.username)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
