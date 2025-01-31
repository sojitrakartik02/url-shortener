import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  shortUrl: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shortUrl",
    required: true,
  },
  timestamp: { type: Date, default: Date.now, index: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String },
  osName: {
    type: String,
    enum: ["Windows", "macOS", "Linux", "iOS", "Android", "Other"],
  },
  deviceType: { type: String, enum: ["Mobile", "Desktop", "Tablet", "Other"] },
  country: { type: String },
  region: { type: String },
  city: { type: String },

  userHash: { type: String, index: true },
});
const Click = mongoose.model("Click", clickSchema);

export default Click;
