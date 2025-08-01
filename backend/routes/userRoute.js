const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const imageProcess = require("../middlewares/imageProcess");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.use(authMiddleware);
router.get("/profile/all", userController.getAllUsers);
router.get("/profile/:id", userController.getProfileInfo);
router.get("/me", userController.getMyProfile);

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

router.post('/artists/:artistId/follow', userController.followArtist);
router.delete('/artists/:artistId/follow', userController.unfollowArtist);

// recently played distinct songs
router.get('/music/recently-played', userController.recentlyPlayed);

// top songs this month
router.get('/music/top-songs-month', userController.topSongsThisMonth);

// top artists this month
router.get('/music/top-artists-month', userController.topArtistsThisMonth);

module.exports = router;
