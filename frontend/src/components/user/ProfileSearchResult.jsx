import React from "react";
import unknown from "../../assets/unknown.jpg";
import { useNavigate } from "react-router-dom";
const profiles = [
  {
    id: 1,
    name: "Son Tung",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Son Tung Nguyen",
    image:
      "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/11/19/975665/Kieu-Toc-Son-Tung-Mt.jpeg",
  },
  {
    id: 3,
    name: "Son Tung Pham",
    image: "/profiles/profile1.jpg",
  },
  {
    id: 4,
    name: "Son Tung Le",
    image: "/profiles/profile2.jpg",
  },
  {
    id: 5,
    name: "Son Tung Thai",
    image: "/profiles/profile3.jpg",
  },
  {
    id: 6,
    name: "Son Tung Ngo",
    image: "/profiles/profile4.jpg",
  },
  {
    id: 7,
    name: "Son Tung Do",
    image: "/profiles/profile5.jpg",
  },
  {
    id: 8,
    name: "Son Tung",
    image: "/profiles/default.jpg",
  },
];

export default function ProfileSearchResult({ searchResult }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-2">
      {searchResult?.users.map((profile) => (
        <div
          key={profile.id}
          onClick={() => navigate(`/profile/${profile._id}`)}
          className="bg-[#181818] hover:bg-[#242424] transition rounded-lg cursor-pointer flex flex-col items-center text-center p-3"
        >
          <div className="w-full aspect-square rounded-full overflow-hidden">
            <img
              src={profile.imageUrl || unknown}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3 text-white text-sm font-semibold truncate w-full">
            {profile.username}
          </div>
          <div className="text-xs text-gray-400">Profile</div>
        </div>
      ))}
    </div>
  );
}
