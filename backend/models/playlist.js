const mongoose = require("mongoose");
const normalizeString = require("../helpers/normolize").normalizeString;
const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameNormalized: { type: String },
    description: { type: String, default: "" },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: { type: Boolean, default: true },
    imageUrl: { type: String, default: "" },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);
playlistSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.nameNormalized = normalizeString(this.name);
  }
  next();
});
module.exports = mongoose.model("Playlist", playlistSchema);
