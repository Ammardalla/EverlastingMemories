
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";


// 1. Users
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 2. Sessions
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// 3. Accounts
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 4. Verification
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 5. Gallery items
export const galleryItems = pgTable("gallery_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  alt: text("alt").notNull(),
  layoutClass: text("layout_class").notNull().default("small"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


 // 6. Shop products
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


// 7. Booking enums
export const bookingPaymentStatusEnum = pgEnum(
  "booking_payment_status",
  ["pending", "paid", "failed", "refunded"]
);

export const bookingStatusEnum = pgEnum(
  "booking_status",
  ["pending", "confirmed", "cancelled"]
);

export const bookingPaymentMethodEnum = pgEnum(
  "booking_payment_method",
  ["cash", "stripe"]
);

// 8. Bookings
export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),

  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),

  service: text("service").notNull(),

  bookingDate: timestamp("booking_date", {
    withTimezone: true,
  }).notNull(),

  packageId: text("package_id").notNull(),
  photoCount: integer("photo_count").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("usd"),

  message: text("message"),

  paymentMethod: bookingPaymentMethodEnum("payment_method")
    .notNull()
    .default("stripe"),

  paymentStatus: bookingPaymentStatusEnum("payment_status")
    .notNull()
    .default("pending"),

  bookingStatus: bookingStatusEnum("booking_status")
    .notNull()
    .default("pending"),

  stripeCheckoutSessionId: text("stripe_checkout_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});



export const orders = pgTable("orders", {
  id: text("id").primaryKey(),

  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),

  items: jsonb("items").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("usd"),

  paymentStatus: text("payment_status")
    .notNull()
    .default("pending"),

  orderStatus: text("order_status")
    .notNull()
    .default("pending"),

  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

