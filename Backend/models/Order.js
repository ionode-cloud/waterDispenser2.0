import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  stationId: { type: String, required: true },
  nozzle: { type: Number, required: true },
  litres: { type: Number, required: true },
  amount: { type: Number, required: true },
  phone: { type: String },
  status: {
    type: String,
    enum: ["created", "paid", "dispensing", "completed", "failed"],
    default: "created",
  },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  dispensedLitres: { type: Number, default: 0 },
});

export default mongoose.model("Order", orderSchema);
