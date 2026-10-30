import { Router } from "express";
import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";

import { db } from "../db/index.js";
import { products, orders } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import { auth } from "../auth.js";

export const productCheckoutRouter = Router();

const DISCOUNT_PERCENT = 10;

productCheckoutRouter.post("/", async (req, res) => {
  let orderId;

  try {
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
    } = req.body ?? {};
    
    // Check the real login session on the server.
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const isLoggedIn = Boolean(session?.user?.id);

    const name =
      typeof customerName === "string" ? customerName.trim() : "";
    const email =
      typeof customerEmail === "string"
        ? customerEmail.trim().toLowerCase()
        : "";
    const phone =
      typeof customerPhone === "string" ? customerPhone.trim() : "";
    const address =
      typeof customerAddress === "string"
        ? customerAddress.trim()
        : "";

    if (
      name.length < 2 ||
      name.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      phone.length < 5 ||
      phone.length > 40 ||
      address.length < 5 ||
      address.length > 500
    ) {
      return res.status(400).json({
        error:
          "Please enter a valid name, email, phone number, and delivery address.",
      });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
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

    // Always retrieve trusted prices from the database.
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

    const orderItems = rows.map((product) => {
      const originalUnitAmountCents = product.priceCents;

      const unitAmountCents = isLoggedIn
        ? Math.round(
            (originalUnitAmountCents * (100 - DISCOUNT_PERCENT)) / 100
          )
        : originalUnitAmountCents;

      return {
        productId: product.id,
        name: product.name,
        quantity: quantities.get(product.id),
        originalUnitAmountCents,
        unitAmountCents,
        discountPercent: isLoggedIn ? DISCOUNT_PERCENT : 0,
      };
    });

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
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      items: orderItems,
      amountCents,
      currency,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

const clientUrl = (
  process.env.CLIENT_URL || "http://localhost:5173"
).replace(/\/+$/, "");

const frontendBasePath =
  clientUrl === "https://ammardalla.github.io"
    ? "/EverlastingMemories"
    : "";

const stripeSession = await stripe.checkout.sessions.create({
  mode: "payment",
  customer_creation: "always",
  customer_email: email,
  client_reference_id: orderId,
  metadata: {
    type: "product_order",
    orderId,
    discountPercent: String(isLoggedIn ? DISCOUNT_PERCENT : 0),
  },
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
    `${clientUrl}${frontendBasePath}/shop-success?order_id=${encodeURIComponent(orderId)}` +
    `&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${clientUrl}${frontendBasePath}/shop?checkout=cancelled`,
});

    await db
      .update(orders)
      .set({
        stripeCheckoutSessionId: stripeSession.id,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    return res.status(201).json({
      checkoutUrl: stripeSession.url,
      orderId,
      discountApplied: isLoggedIn,
      discountPercent: isLoggedIn ? DISCOUNT_PERCENT : 0,
      amountCents,
      currency,
      items: orderItems,
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
