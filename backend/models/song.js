const mongoose = require("mongoose");
const normalizeString = require("../helpers/normolize").normalizeString;
const songSchema = new mongoose.Schema(
  {
    isApproved: { type: Boolean, default: false },
    title: { type: String, required: true, trim: true },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,
    },
    duration: { type: Number, required: true },
    audioUrl: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    playCount: { type: Number, default: 0 },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Song", songSchema);
