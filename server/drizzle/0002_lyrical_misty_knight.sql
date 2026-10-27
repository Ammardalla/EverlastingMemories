CREATE TYPE "public"."booking_payment_method" AS ENUM('cash', 'stripe');--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "payment_method" "booking_payment_method" DEFAULT 'stripe' NOT NULL;