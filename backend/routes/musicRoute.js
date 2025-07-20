const express = require("express");
const router = express.Router();
const { streamingAudio } = require("../controllers/musicController");
router.get("/songs/:id/stream", streamingAudio);
module.exports = router;
