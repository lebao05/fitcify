import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import PlayplistBar from "./PlayplistBar.jsx";
import ArtistBar from "./ArtistBar.jsx";
import AlbumBar from "./AlbumBar.jsx";
import LikedTrackBar from "./LikedTrackBar.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  createUserPlaylist,
  fetchLikedSongs,
  fetchUserPlaylists,
} from "../../redux/slices/myCollectionSlice.js";
import ContextMenu from "./ContextMenu.jsx"; // ✅ Adjust this path if needed
import { deletePlaylist } from "../../services/playlistApi.js";
import default_music from "../../assets/default-music.png";
const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playlist = useSelector((state) => state.myCollection.playlists);
  const user = useSelector((state) => state.user.myAuth);
  const likedTracks = useSelector((state) => state.myCollection.likedSongs);
  const likedItem = {
    cover: assets.liked_icon,
    title: "Liked Songs",
    subtitle: `Playlist • ${likedTracks.length} ${
      likedTracks.length === 1 ? "song" : "songs"
    }`,
  };
  const [contextMenu, setContextMenu] = useState(null); // ✅ context menu state
  const handleCreatePlaylist = async () => {
    const result = await dispatch(
      createUserPlaylist({
        name: `My playlist #${playlist.length + 1}`,
        description: "",
        isPublic: true,
        cover: "",
      })
    ).unwrap();
    await dispatch(fetchUserPlaylists());
    if (result?._id) {
      navigate("/playlist/" + result._id);
    } else {
      console.error("Failed to create playlist");
    }
  };

  const handleContextMenu = (e, playlist) => {
    e.preventDefault();
    const options = [
      {
        label: "Go to playlist",
        onClick: async () => {
          navigate(`/playlist/${playlist._id}`);
        },
      },
      {
        label: "Delete",
        onClick: async () => {
          await deletePlaylist({ playlistId: playlist._id });
          await dispatch(fetchUserPlaylists());
        },
      },
      {
        label: "Create New Playlist",
        onClick: async () => {
          await handleCreatePlaylist();
        },
      },
    ];
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      playlist,
      options,
    });
  };

  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserPlaylists());
      dispatch(fetchLikedSongs());
    }
  }, [user, dispatch]);

  return (
    <div className="w-[20%] mt-14 min-w-[250px] h-full flex flex-col p-2 gap-2 text-white bg-black">
      <div className="bg-[#121212] flex-1 rounded flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="stack_icon" />
            <p className="font-semibold">Your Library</p>
          </div>
          <img
            onClick={handleCreatePlaylist}
            className="cursor-pointer rounded-full hover:bg-[#282828] w-8 h-8 p-1"
            src={assets.plus_icon}
            alt="Create Playlist"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-1 scroll-on-hover pb-32">
          <LikedTrackBar
            cover={likedItem.cover}
            title={likedItem.title}
            subtitle={likedItem.subtitle}
            onClick={() => navigate("/likedtrack")}
          />

          {playlist?.map((item) => (
            <div
              key={item._id}
              onContextMenu={(e) => handleContextMenu(e, item)} // ✅ Right-click
            >
              <PlayplistBar
                cover={item.imageUrl || default_music}
                title={item.name}
                subtitle={`Playlist • ${item.owner?.name || "You"}`}
                onClick={() => navigate(`/playlist/${item._id}`)}
                id={item._id}
              />
            </div>
          ))}

          {user?.followees &&
            user.followees.map((item) => (
              <ArtistBar
                key={item._id}
                avatar={item.avatarUrl}
                id={item._id}
                name={item.username}
                onClick={() => console.log("Playlist clicked", item.username)}
              />
            ))}
        </div>
      </div>

      {/* ✅ Context menu UI */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default Sidebar;
