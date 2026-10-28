
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";

import { db } from "../db/index.js";
import { products, orders } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";

export const productCheckoutRouter = Router();

productCheckoutRouter.post("/", async (req, res) => {
  let orderId;

  try {
const { items } = req.body ?? {};

if (
  !Array.isArray(items) ||
  items.length === 0 ||
  items.length > 50
) {
  return res.status(400).json({
    error: "Please provide valid cart items.",
  });
}

    const quantities = new Map();

    for (const item of items) {
      if (
        !item ||
        typeof item.id !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20
      ) {
        return res.status(400).json({
          error: "Invalid product or quantity.",
        });
      }

      quantities.set(
        item.id,
        (quantities.get(item.id) || 0) + item.quantity
      );
    }

    for (const quantity of quantities.values()) {
      if (quantity > 20) {
        return res.status(400).json({
          error: "Maximum quantity per product is 20.",
        });
      }
    }

    const productIds = [...quantities.keys()];

    const rows = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    if (
      rows.length !== productIds.length ||
      rows.some((product) => !product.isActive)
    ) {
      return res.status(400).json({
        error: "One or more products are unavailable.",
      });
    }

    const orderItems = rows.map((product) => ({
      productId: product.id,
      name: product.name,
      quantity: quantities.get(product.id),
      unitAmountCents: product.priceCents,
    }));

    const currency = rows[0].currency.toLowerCase();

    if (
      rows.some(
        (product) => product.currency.toLowerCase() !== currency
      )
    ) {
      return res.status(400).json({
        error: "Products must use the same currency.",
      });
    }

    const amountCents = orderItems.reduce(
      (total, item) =>
        total + item.unitAmountCents * item.quantity,
      0
    );

    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
      return res.status(400).json({
        error: "Invalid order total.",
      });
    }

    orderId = randomUUID();

    await db.insert(orders).values({
    id: orderId,
    customerEmail: "",
    items: orderItems,
    amountCents,
    currency,
    paymentStatus: "pending",
    orderStatus: "pending",
    });

    const clientUrl = (
      process.env.CLIENT_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_creation: "always",
        client_reference_id: orderId,
        metadata: { type: "product_order", orderId },
      line_items: orderItems.map((item) => ({
        price_data: {
          currency,
          unit_amount: item.unitAmountCents,
          product_data: {
            name: item.name,
          },
        },
        quantity: item.quantity,
      })),
      success_url:
        `${clientUrl}/shop-success?order_id=${orderId}` +
        `&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/shop?checkout=cancelled`,
    });

    await db
      .update(orders)
      .set({
        stripeCheckoutSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    return res.status(201).json({
      checkoutUrl: session.url,
      orderId,
    });
  } catch (error) {
    console.error("Product checkout error:", error);

    if (orderId) {
      try {
        await db
          .update(orders)
          .set({
            paymentStatus: "failed",
            orderStatus: "cancelled",
            updatedAt: new Date(),
          })
          .where(eq(orders.id, orderId));
      } catch (dbError) {
        console.error("Could not update product order:", dbError);
      }
    }

    return res.status(500).json({
      error: "Could not create product checkout session.",
    });
  }
});
