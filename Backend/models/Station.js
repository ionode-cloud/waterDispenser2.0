import mongoose from "mongoose";

const nozzleSchema = new mongoose.Schema(
  {
    nozzleNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["free", "busy", "faulty", "offline"],
      default: "free",
    },
    lastUsed: { type: Date },
    dispensedLitres: { type: Number, default: 0 },
  },
  { _id: false }
);

const sensorSchema = new mongoose.Schema(
  {
    tds: Number,
    ph: Number,
    turbidity: Number,
    waterTemp: Number,
    waterLevel: Number,
  },
  { _id: false }
);

const meterSchema = new mongoose.Schema(
  {
    voltage: Number,
    current: Number,
    power: Number,
    energy: Number,
  },
  { _id: false }
);

const stationSchema = new mongoose.Schema({
  stationId: { type: String, required: true, unique: true },
  name: { type: String },
  address: { type: String },
  nozzles: [nozzleSchema],
  sensors: sensorSchema,
  powerStatus: { type: Boolean, default: true },
  networkStatus: { type: Boolean, default: true },
  meter: meterSchema,
  liveStatus: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Station", stationSchema);
