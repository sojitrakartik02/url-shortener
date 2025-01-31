import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Invalid URL format",
    },
  },
  alias: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (v) => /^[\w\-]+$/.test(v),
      message: "Invalid alias format",
    },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, index: true },
  createdAt: { type: Date, default: Date.now },
});

const Short = mongoose.model("shortUrl", shortUrlSchema);

export default Short;
