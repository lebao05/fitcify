const mongoose = require("mongoose");
const normalizeString = require("../helpers/normolize").normalizeString;
const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleNormalized: { type: String },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    releaseDate: { type: Date },
    imageUrl: { type: String, default: "" },
    totalDuration: { type: Number, default: 0 },
    description: { type: String, default: "" },
    viewCount: { type: Number, default: 0 },
    playCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
albumSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.titleNormalized = normalizeString(this.title);
  }
  next();
});
module.exports = mongoose.model("Album", albumSchema);
