const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const imageProcess = require("../middlewares/imageProcess");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.use(authMiddleware);
router.get("/profile/all", userController.getAllUsers);
router.get("/profile/followed-artists", userController.getFollowedArtists);
router.get("/me", userController.getMyProfile);
router.get("/profile/:id", userController.getProfileInfo);

router.put(
  "/profile",
  upload.single("avatar"),
  imageProcess(),
  userController.updateProfileInfo
);

router.delete("/profile/avatar", userController.deleteProfileAvatar);

router.get("/account", userController.getAccountInfo);

router.patch("/account", userController.updateAccountInfo);

router.post("/artists/:artistId/follow", userController.followArtist);
router.delete("/artists/:artistId/follow", userController.unfollowArtist);
router.get("/artists/:artistId/followers", userController.getArtistFollowers);

// top songs this month
router.get('/music/top-songs-month', userController.topSongsThisMonth);


module.exports = router;
