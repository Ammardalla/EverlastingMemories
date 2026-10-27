import { webcrypto } from "node:crypto";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { galleryRouter } from "./routes/galleryItems.js";
import { bookingsRouter } from "./routes/bookings.js";
import { stripeWebhookRouter } from "./routes/stripeWebhook.js";

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(
    cors({
      origin: process.env.CLIENT_URL ?? "http://localhost:5173",
      credentials: true,
    })
  );

  app.use("/api/stripe", stripeWebhookRouter);

  app.all("/api/auth/{*any}", toNodeHandler(auth));

  app.use(express.json());

  app.use("/api/gallery", galleryRouter);
  app.use("/api/bookings", bookingsRouter);

  app.get("/", (req, res) => {
    res.json({ message: "Everlasting Memories API is running" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
