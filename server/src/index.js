import { webcrypto } from "node:crypto";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { galleryRouter } from "./routes/galleryItems.js";
import { productsRouter } from "./routes/products.js";
import { bookingsRouter } from "./routes/bookings.js";
import { stripeWebhookRouter } from "./routes/stripeWebhook.js";
import { productCheckoutRouter } from "./routes/productCheckout.js";
import { adminRouter } from "./routes/admin.js";

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
  app.use("/api/admin", adminRouter);
  
app.get("/api/admin/check", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "you must sign-in first",
      });
    }

    const adminUserId = process.env.ADMIN_USER_ID;

    if (
      !adminUserId ||
      session.user.id !== adminUserId
    ) {
      return res.status(403).json({
        success: false,
        message: "you don't have access",
      });
    }

    return res.json({
      success: true,
      message: "Admin checked successful",
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("Admin check error:", error);

    return res.status(500).json({
      success: false,
      message: "Admin check error",
    });
  }
});


  app.use("/api/gallery", galleryRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/products/checkout", productCheckoutRouter);
  app.use("/api/bookings", bookingsRouter);

  app.get("/", (req, res) => {
    res.json({ message: "Everlasting Memories API is running" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
