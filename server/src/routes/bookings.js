
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { bookings } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";

export const bookingsRouter = Router();

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
        } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
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
    bookingId = randomUUID();

    await db.insert(bookings).values({
      id: bookingId,
      customerName: name.trim(),
      email: email.trim(),
      service,
      bookingDate,
      packageId,
      photoCount: selectedPackage.photos,
      amountCents: selectedPackage.amountCents,
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
            message: "Booking saved. Payment is due in cash at the shop.",
        });
    }

    const clientUrl =
      process.env.CLIENT_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email.trim(),
      client_reference_id: bookingId,
      metadata: {
        bookingId,
        packageId,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: selectedPackage.amountCents,
            product_data: {
              name: `${selectedPackage.label} Photography Package`,
              description: `${selectedPackage.photos} edited photos`,
            },
          },
          quantity: 1,
        },
      ],
      success_url:
        `${clientUrl}/booking-success` +
        `?booking_id=${bookingId}` +
        `&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        `${clientUrl}/booking-cancelled` +
        `?booking_id=${bookingId}`,
    });

    await db
      .update(bookings)
      .set({
        stripeCheckoutSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    return res.status(201).json({
      checkoutUrl: session.url,
      bookingId,
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
