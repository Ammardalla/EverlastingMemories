import { Router } from "express";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { bookings } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import { auth } from "../auth.js";

export const bookingsRouter = Router();

const DISCOUNT_PERCENT = 10;

const packages = {
  "10": { photos: 10, amountCents: 3000, label: "Essential" },
  "20": { photos: 20, amountCents: 5000, label: "Classic" },
  "30": { photos: 30, amountCents: 7000, label: "Premium" },
};

const allowedServices = [
  "portrait",
  "couples",
  "wedding",
  "editorial",
];

bookingsRouter.post("/checkout", async (req, res) => {
  let bookingId;

  try {
    const {
      name,
      email,
      service,
      date,
      packageId,
      message,
      paymentMethod,
    } = req.body ?? {};

    // Verify the user's real session on the server.
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const isLoggedIn = Boolean(session?.user?.id);

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 120 ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      email.trim().length > 254 ||
      !allowedServices.includes(service) ||
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !packages[packageId] ||
      !["cash", "stripe"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        error: "Please provide valid booking details.",
      });
    }

    const bookingDate = new Date(`${date}T12:00:00.000Z`);

    if (
      Number.isNaN(bookingDate.getTime()) ||
      bookingDate.toISOString().slice(0, 10) !== date
    ) {
      return res.status(400).json({
        error: "Invalid booking date.",
      });
    }

    const selectedPackage = packages[packageId];

    // Calculate the final amount on the server in cents.
    const originalAmountCents = selectedPackage.amountCents;
    const discountPercent = isLoggedIn ? DISCOUNT_PERCENT : 0;

    const amountCents = isLoggedIn
      ? Math.round(
          (originalAmountCents * (100 - DISCOUNT_PERCENT)) / 100
        )
      : originalAmountCents;

    bookingId = randomUUID();

    await db.insert(bookings).values({
      id: bookingId,
      customerName: name.trim(),
      email: email.trim(),
      service,
      bookingDate,
      packageId,
      photoCount: selectedPackage.photos,
      amountCents,
      currency: "usd",
      message:
        typeof message === "string" ? message.trim() || null : null,
      paymentMethod,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    if (paymentMethod === "cash") {
      return res.status(201).json({
        bookingId,
        paymentMethod: "cash",
        originalAmountCents,
        discountPercent,
        amountCents,
        currency: "usd",
        message: "Booking saved. Payment is due in cash at the shop.",
      });
    }

   
const clientUrl = (
  process.env.CLIENT_URL || "http://localhost:5173"
).replace(/\/+$/, "");

const frontendBasePath =
  clientUrl === "https://ammardalla.github.io"
    ? "/EverlastingMemories"
    : "";

const stripeSession = await stripe.checkout.sessions.create({
  mode: "payment",
  customer_email: email.trim(),
  client_reference_id: bookingId,
  metadata: {
    bookingId,
    packageId,
    discountPercent: String(discountPercent),
    originalAmountCents: String(originalAmountCents),
    amountCents: String(amountCents),
  },
  line_items: [
    {
      price_data: {
        currency: "usd",
        unit_amount: amountCents,
        product_data: {
          name: `${selectedPackage.label} Photography Package`,
          description: `${selectedPackage.photos} edited photos${
            discountPercent
              ? ` (${discountPercent}% member discount)`
              : ""
          }`,
        },
      },
      quantity: 1,
    },
  ],
  success_url:
    `${clientUrl}${frontendBasePath}/booking-success` +
    `?booking_id=${encodeURIComponent(bookingId)}` +
    `&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url:
    `${clientUrl}${frontendBasePath}/booking-cancelled` +
    `?booking_id=${encodeURIComponent(bookingId)}`,
});


    await db
      .update(bookings)
      .set({
        stripeCheckoutSessionId: stripeSession.id,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    return res.status(201).json({
      checkoutUrl: stripeSession.url,
      bookingId,
      originalAmountCents,
      discountPercent,
      amountCents,
      currency: "usd",
    });
  } catch (error) {
    console.error("Booking checkout error:", error);

    if (bookingId) {
      try {
        await db
          .update(bookings)
          .set({
            paymentStatus: "failed",
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, bookingId));
      } catch (dbError) {
        console.error("Could not update booking status:", dbError);
      }
    }

    return res.status(500).json({
      error: "Could not create the checkout session.",
    });
  }
});
