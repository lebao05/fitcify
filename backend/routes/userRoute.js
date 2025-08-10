const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const imageProcess = require("../middlewares/imageProcess");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get(
  "/profile/followed-artists/:userId",
  userController.getFollowedArtists
);
router.get("/me", authMiddleware, userController.getMyProfile);
router.get("/profile/:id", userController.getProfileInfo);

router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  imageProcess(),
  userController.updateProfileInfo
);

router.delete(
  "/profile/avatar",
  authMiddleware,
  userController.deleteProfileAvatar
);

router.get("/account", authMiddleware, userController.getAccountInfo);

router.put("/account", authMiddleware, userController.updateAccountInfo);

router.post(
  "/artists/:artistId/follow",
  authMiddleware,
  userController.followArtist
);
router.delete(
  "/artists/:artistId/follow",
  authMiddleware,
  userController.unfollowArtist
);
router.get("/artists/:artistId/followers", userController.getArtistFollowers);

// top songs this month
router.get(
  "/music/top-songs-month",
  authMiddleware,
  userController.topSongsThisMonth
);

// top artists this month
router.get(
  "/music/top-artists-month",
  authMiddleware,
  userController.topArtistsThisMonth
);

module.exports = router;
