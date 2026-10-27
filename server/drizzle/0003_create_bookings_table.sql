-- Custom SQL migration file, put your code below! --
CREATE TYPE "public"."booking_payment_status" AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);
--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM (
  'pending',
  'confirmed',
  'cancelled'
);
--> statement-breakpoint
CREATE TABLE "bookings" (
  "id" text PRIMARY KEY NOT NULL,
  "customer_name" text NOT NULL,
  "email" text NOT NULL,
  "service" text NOT NULL,
  "booking_date" timestamp with time zone NOT NULL,
  "package_id" text NOT NULL,
  "photo_count" integer NOT NULL,
  "amount_cents" integer NOT NULL,
  "currency" text DEFAULT 'usd' NOT NULL,
  "message" text,
  "payment_method" "public"."booking_payment_method" DEFAULT 'stripe' NOT NULL,
  "payment_status" "public"."booking_payment_status" DEFAULT 'pending' NOT NULL,
  "booking_status" "public"."booking_status" DEFAULT 'pending' NOT NULL,
  "stripe_checkout_session_id" text,
  "stripe_payment_intent_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "bookings_stripe_checkout_session_id_unique"
    UNIQUE ("stripe_checkout_session_id")
);
