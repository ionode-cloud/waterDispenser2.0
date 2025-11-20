import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { Server as IOServer } from "socket.io";
import Station from "./models/Station.js";
import Device from "./models/Device.js";
import Order from "./models/Order.js";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyWebhookSignature,
} from "./services/RazorpayService.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const USE_SSL = process.env.USE_SSL === "true";
const HOST = process.env.HOSTNAME || "0.0.0.0";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

await mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Mongo connect err", err);
    process.exit(1);
  });

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(bodyParser.json({ type: "*/*" }));
app.post("/admin/stations", async (req, res) => {
  try {
    const { name, address, nozzleCount } = req.body;
    if (!nozzleCount)
      return res.status(400).json({ error: "nozzleCount required" });
    const stationId = (
      Math.floor(Math.random() * 9000000) + 1000000
    ).toString();
    const nozzles = [];
    for (let i = 1; i <= nozzleCount; i++)
      nozzles.push({ nozzleNumber: i, status: "free" });
    const st = await Station.create({ stationId, name, address, nozzles });
    return res.json({ station: st });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/admin/stations", async (req, res) => {
  const list = await Station.find().lean();
  res.json(list);
});
app.get("/station/:stationId", async (req, res) => {
  const { stationId } = req.params;
  const station = await Station.findOne({ stationId }).lean();
  if (!station) return res.status(404).json({ error: "not_found" });
  res.json({ station });
});
app.post("/webhook/razorpay", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const raw = JSON.stringify(req.body);
  if (process.env.RAZORPAY_WEBHOOK_SECRET) {
    const ok = verifyWebhookSignature(raw, signature);
    if (!ok)
      return res.status(400).json({ ok: false, message: "invalid_signature" });
  }

  try {
    const event = req.body.event;
    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const orderDoc = await Order.findOneAndUpdate(
        { orderId },
        { $set: { status: "paid", razorpayPaymentId: paymentId } },
        { new: true }
      );
      if (orderDoc && io) {
        io.to(`station_${orderDoc.stationId}`).emit(
          "payment_received",
          orderDoc
        );
      }
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("webhook processing error", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});
let server;
if (USE_SSL && process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
  const key = fs.readFileSync(process.env.SSL_KEY_PATH);
  const cert = fs.readFileSync(process.env.SSL_CERT_PATH);
  server = https.createServer({ key, cert }, app);
  console.log("Starting HTTPS server");
} else {
  server = http.createServer(app);
  console.log("Starting HTTP server (use SSL or reverse proxy in production)");
}
const io = new IOServer(server, {
  cors: { origin: CORS_ORIGIN, methods: ["GET", "POST"] },
  maxHttpBufferSize: 1e6,
});
const orderSocketMap = new Map();
function stationRoom(stationId) {
  return `station_${stationId}`;
}
function nozzleRoom(stationId, nozzle) {
  return `station_${stationId}_nozzle_${nozzle}`;
}

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);
  // Device registers itself (must send stationId + nozzle)
  socket.on("register_device", async (payload) => {
    const { deviceId, stationId, nozzle } = payload || {};
    if (!deviceId || !stationId)
      return socket.emit("error", { message: "deviceId & stationId required" });
    socket.join(nozzleRoom(stationId, nozzle));
    socket.join(stationRoom(stationId));
    socket.data.isDevice = true;
    socket.data.deviceId = deviceId;
    socket.data.stationId = stationId;
    socket.data.nozzle = nozzle;
    await Device.findOneAndUpdate(
      { deviceId },
      { deviceId, stationId, nozzleNumber: nozzle, lastSeen: new Date() },
      { upsert: true }
    );
    if (nozzle) {
      await Station.updateOne(
        { stationId, "nozzles.nozzleNumber": nozzle },
        { $set: { "nozzles.$.status": "free" } }
      );
    }
    io.to(stationRoom(stationId)).emit("device_online", { deviceId, nozzle });
    socket.emit("registered", { ok: true });
  });

  // Device sends telemetry
  socket.on("telemetry", async (msg) => {
    // msg: { stationId, nozzle, data:{ ph, tds, turbidity, waterTemp, waterLevel, voltage, current } }
    const { stationId, nozzle, data } = msg || {};
    if (!stationId || !data)
      return socket.emit("error", { message: "stationId & data required" });
    const update = {};
    if (data.ph !== undefined) update["sensors.ph"] = data.ph;
    if (data.tds !== undefined) update["sensors.tds"] = data.tds;
    if (data.turbidity !== undefined)
      update["sensors.turbidity"] = data.turbidity;
    if (data.waterTemp !== undefined)
      update["sensors.waterTemp"] = data.waterTemp;
    if (data.waterLevel !== undefined)
      update["sensors.waterLevel"] = data.waterLevel;
    if (data.voltage !== undefined) update["meter.voltage"] = data.voltage;
    if (data.current !== undefined) update["meter.current"] = data.current;
    if (data.power !== undefined) update["meter.power"] = data.power;
    if (Object.keys(update).length) {
      await Station.findOneAndUpdate(
        { stationId },
        { $set: update },
        { upsert: true }
      );
    }
    io.to(stationRoom(stationId)).emit("sensor_update", {
      stationId,
      nozzle,
      data,
      ts: new Date(),
    });
  });
  socket.on("join_station", async (payload) => {
    const { stationId, role } = payload || {};
    if (!stationId)
      return socket.emit("error", { message: "stationId required" });
    socket.join(stationRoom(stationId));
    socket.data.role = role || "client";
    socket.data.stationId = stationId;
    const station = await Station.findOne({ stationId }).lean();
    socket.emit("station_snapshot", station);
  });
  socket.on("join_admin", () => {
    socket.join("admins");
  });
  socket.on("admin_create_station", async (payload) => {
    const { name, address, nozzleCount } = payload || {};
    if (!nozzleCount)
      return socket.emit("error", { message: "nozzleCount required" });
    const stationId = (
      Math.floor(Math.random() * 9000000) + 1000000
    ).toString();
    const nozzles = [];
    for (let i = 1; i <= nozzleCount; i++)
      nozzles.push({ nozzleNumber: i, status: "free" });
    const st = await Station.create({ stationId, name, address, nozzles });
    io.to("admins").emit("station_created", st);
    socket.emit("admin_create_success", st);
  });
  socket.on("start_payment", async (payload) => {
    const { stationId, nozzle, litres, phone, amount } = payload || {};
    if (!stationId || !nozzle || !litres || !amount)
      return socket.emit("error", { message: "missing_fields" });
    try {
      const receipt = `station_${stationId}_nozzle_${nozzle}_${Date.now()}`;
      const order = await createRazorpayOrder({ amount, receipt });
      const orderDoc = await Order.create({
        orderId: order.id,
        stationId,
        nozzle,
        litres,
        amount,
        phone,
        status: "created",
      });
      orderSocketMap.set(order.id, socket);
      socket.emit("order_created", order);
      io.to(stationRoom(stationId)).emit("order_created", {
        orderId: order.id,
        nozzle,
        amount,
        litres,
      });
    } catch (err) {
      console.error("create order err", err);
      socket.emit("error", {
        message: "order_create_failed",
        details: err.message,
      });
    }
  });

  // Payment result: frontend sends back razorpay ids after checkout
  socket.on("payment_result", async (payload) => {
    // { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      payload || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return socket.emit("error", { message: "missing_payment_fields" });
    }
    const ok = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    if (!ok) {
      await Order.updateOne(
        { orderId: razorpay_order_id },
        { $set: { status: "failed" } }
      );
      return socket.emit("payment_invalid", { orderId: razorpay_order_id });
    }

    const orderDoc = await Order.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { $set: { status: "paid", razorpayPaymentId: razorpay_payment_id } },
      { new: true }
    );
    if (!orderDoc) return socket.emit("error", { message: "order_not_found" });
    const initiatorSocket = orderSocketMap.get(razorpay_order_id);
    if (initiatorSocket && initiatorSocket.connected) {
      initiatorSocket.emit("payment_verified", orderDoc);
    }
    const nozzleRoomName = nozzleRoom(orderDoc.stationId, orderDoc.nozzle);
    const clients = await io.in(nozzleRoomName).fetchSockets();
    if (!clients || clients.length === 0) {
      io.to(stationRoom(orderDoc.stationId)).emit(
        "payment_verified_device_offline",
        { order: orderDoc }
      );
      return socket.emit("error", { message: "device_not_connected" });
    }
    const st = await Station.findOne({ stationId: orderDoc.stationId });
    const nozzleObj = st?.nozzles?.find(
      (n) => n.nozzleNumber === orderDoc.nozzle
    );
    if (!nozzleObj)
      return socket.emit("error", { message: "nozzle_not_found" });
    if (nozzleObj.status === "busy")
      return socket.emit("error", { message: "nozzle_not_free" });
    await Station.updateOne(
      {
        stationId: orderDoc.stationId,
        "nozzles.nozzleNumber": orderDoc.nozzle,
      },
      { $set: { "nozzles.$.status": "busy", "nozzles.$.lastUsed": new Date() } }
    );
    await Order.updateOne(
      { orderId: razorpay_order_id },
      { $set: { status: "dispensing" } }
    );
    io.to(nozzleRoomName).emit("open_nozzle", {
      nozzle: orderDoc.nozzle,
      litres: orderDoc.litres,
      orderId: razorpay_order_id,
    });
    io.to(stationRoom(orderDoc.stationId)).emit("nozzle_update", {
      nozzle: orderDoc.nozzle,
      status: "busy",
      orderId: razorpay_order_id,
    });
  });
  socket.on("dispense_started", async (payload) => {
    const { stationId, nozzle, orderId } = payload || {};
    if (!stationId || !nozzle || !orderId) return;
    io.to(stationRoom(stationId)).emit("dispense_started", {
      nozzle,
      orderId,
      ts: new Date(),
    });
    await Order.updateOne({ orderId }, { $set: { status: "dispensing" } });
  });
  socket.on("dispense_completed", async (payload) => {
    const { stationId, nozzle, orderId, dispensedLitres } = payload || {};
    if (!stationId || !nozzle || !orderId) return;
    await Station.updateOne(
      { stationId, "nozzles.nozzleNumber": nozzle },
      { $set: { "nozzles.$.status": "free" } }
    );
    await Order.findOneAndUpdate(
      { orderId },
      {
        $set: { status: "completed", completedAt: new Date(), dispensedLitres },
      },
      { new: true }
    );
    await Station.updateOne(
      { stationId, "nozzles.nozzleNumber": nozzle },
      { $inc: { "nozzles.$.dispensedLitres": dispensedLitres || 0 } }
    );
    io.to(stationRoom(stationId)).emit("dispense_completed", {
      nozzle,
      orderId,
      dispensedLitres,
      ts: new Date(),
    });
    orderSocketMap.delete(orderId);
  });

  // manual force-open from admin/tablet
  socket.on("force_open_nozzle", async (payload) => {
    const { stationId, nozzle, litres } = payload || {};
    if (!stationId || !nozzle)
      return socket.emit("error", { message: "stationId & nozzle required" });
    const nozzleRoomName = nozzleRoom(stationId, nozzle);
    const clients = await io.in(nozzleRoomName).fetchSockets();
    if (!clients || clients.length === 0)
      return socket.emit("error", { message: "device_not_connected" });
    await Station.updateOne(
      { stationId, "nozzles.nozzleNumber": nozzle },
      { $set: { "nozzles.$.status": "busy" } }
    );
    io.to(nozzleRoomName).emit("open_nozzle", {
      nozzle,
      litres,
      orderId: null,
    });
    io.to(stationRoom(stationId)).emit("nozzle_update", {
      nozzle,
      status: "busy",
    });
    socket.emit("force_open_sent", { ok: true });
  });

  // handle disconnect
  socket.on("disconnect", async (reason) => {
    console.log("socket disconnected", socket.id, reason);
    if (socket.data?.isDevice) {
      const stationId = socket.data.stationId;
      const nozzle = socket.data.nozzle;
      if (stationId && nozzle) {
        await Station.updateOne(
          { stationId, "nozzles.nozzleNumber": nozzle },
          { $set: { "nozzles.$.status": "offline" } }
        );
        io.to(stationRoom(stationId)).emit("device_offline", {
          deviceId: socket.data.deviceId,
          nozzle,
        });
      }
      if (socket.data?.deviceId) {
        await Device.updateOne(
          { deviceId: socket.data.deviceId },
          { $set: { lastSeen: new Date() } }
        );
      }
    }
  });
});
server.listen(PORT, HOST, () =>
  console.log(`Server listening on ${HOST}:${PORT}`)
);
