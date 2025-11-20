import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  stationId: { type: String, required: true },
  nozzleNumber: { type: Number },
  lastSeen: { type: Date, default: Date.now },
});

export default mongoose.model("Device", deviceSchema);
