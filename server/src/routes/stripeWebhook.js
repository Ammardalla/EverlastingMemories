import express from "express";
import { Router } from "express";
import { and, eq, ne } from "drizzle-orm";

import { db } from "../db/index.js";
import { bookings } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";

export const stripeWebhookRouter = Router();

stripeWebhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(400).send("Missing Stripe webhook configuration.");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error("Invalid Stripe webhook signature:", error.message);
      return res.status(400).send("Invalid webhook signature.");
    }

    try {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        return res.json({ received: true });
      }

      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        if (session.payment_status === "paid") {
          await db
            .update(bookings)
            .set({
              paymentStatus: "paid",
              bookingStatus: "confirmed",
              stripePaymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : null,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(bookings.id, bookingId),
                eq(bookings.stripeCheckoutSessionId, session.id)
              )
            );
        }
      } else if (
        event.type === "checkout.session.expired" ||
        event.type === "checkout.session.async_payment_failed"
      ) {
        await db
          .update(bookings)
          .set({
            paymentStatus: "failed",
            bookingStatus: "cancelled",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(bookings.id, bookingId),
              eq(bookings.stripeCheckoutSessionId, session.id),
              ne(bookings.paymentStatus, "paid")
            )
          );
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook processing error:", error);
      return res.status(500).send("Webhook processing failed.");
    }
  }
);
