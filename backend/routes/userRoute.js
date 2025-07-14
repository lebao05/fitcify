const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const imageProcess = require("../middlewares/imageProcess");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.use(authMiddleware);

router.get("/profile", userController.getProfileInfo);

router.get("/profile/followed-artists", userController.getFollowedArtists);

router.put(
  "/profile",
  upload.single("avatar"),
  imageProcess(),
  userController.updateProfileInfo
);

router.delete("/profile/avatar", userController.deleteProfileAvatar);

router.get("/account", userController.getAccountInfo);

router.patch("/account", userController.updateAccountInfo);

module.exports = router;
