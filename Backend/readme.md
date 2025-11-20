# Water Dispenser Backend (Socket.IO)

1. Create folder, paste files exactly as above.

2. npm install

3. Copy .env.example -> .env and fill values:

   - MONGO_URI
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - RAZORPAY_WEBHOOK_SECRET (optional)
   - USE_SSL if using cert paths

4. Start MongoDB (local or Atlas).

5. npm run dev (or npm start)

6. HTTP endpoints:

   - POST /admin/stations
     body: { name, address, nozzleCount }
   - GET /admin/stations
   - GET /station/:stationId

7. Socket.IO (connect to ws URL):

   - From frontend or device:
     const socket = io("https://your-domain", { transports: ["websocket"] });

   Device register:
   socket.emit("register_device", { deviceId, stationId, nozzle });

   Device telemetry:
   socket.emit("telemetry", { stationId, nozzle, data: { ph, tds, turbidity, waterTemp, waterLevel, voltage, current } });

   Tablet join station:
   socket.emit("join_station", { stationId, role: "tablet" });

   Admin join:
   socket.emit("join_admin");

   Start payment (tablet):
   socket.emit("start_payment", { stationId, nozzle, litres, phone, amount });

   On order_created -> frontend starts Razorpay checkout with order.id

   After payment success -> frontend must send:
   socket.emit("payment_result", { razorpay_order_id, razorpay_payment_id, razorpay_signature });

   Device receives open_nozzle:
   socket.on("open_nozzle", ({ nozzle, litres, orderId }) => { ... })

   Device should send:
   socket.emit("dispense_started", { stationId, nozzle, orderId });
   socket.emit("dispense_completed", { stationId, nozzle, orderId, dispensedLitres });

8. Notes:

- Persisting orders ensures webhook or restarts don't lose data.
- For production, add authentication (JWT / API keys) for admin endpoints and socket events.
- Use SSL (wss) in production or front your app with Nginx/Cloudflare to terminate TLS.
- For scale, move in-memory maps to Redis pub/sub (socket.io adapter) so multiple backend instances share rooms.
