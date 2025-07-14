import axiosInstance from "../configs/axios";

/* ───── Profile Info ───── */
export const getProfileInfo = async () => {
  const res = await axiosInstance.get("/user/profile");
  return res.data;
};

export const updateProfileInfo = async (formData) => {
  const res = await axiosInstance.put("/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProfileAvatar = async () => {
  const res = await axiosInstance.delete("/user/profile/avatar");
  return res.data;
};

export const getFollowedArtists = async () => {
  const res = await axiosInstance.get("/user/profile/followed-artists");
  return res.data;
};

/* ───── Account Info ───── */
export const getAccountInfo = async () => {
  const res = await axiosInstance.get("/user/account");
  return res.data;
};

export const updateAccountInfo = async (payload) => {
  const res = await axiosInstance.patch("/user/account", payload);
  return res.data;
};
