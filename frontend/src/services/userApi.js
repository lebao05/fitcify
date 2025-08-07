import axiosInstance from "../configs/axios";

/* ───── Profile Info ───── */
export const getCurrentUserRole = async () => {
  const res = await axiosInstance.get("/user/role");
  return res.data;
};
export const getMyProfile = async () => {
  const res = await axiosInstance.get("/user/me");
  return res.data;
};
export const getUserProfileById = async (id) => {
  const res = await axiosInstance.get(`/user/profile/${id}`);
  return res.data;
};
export const getAllUser = async () => {
  const res = await axiosInstance.get("/user/profile/all");
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
