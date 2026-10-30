CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_address" text NOT NULL,
	"items" jsonb NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"order_status" text DEFAULT 'pending' NOT NULL,
	"stripe_checkout_session_id" text,
	"stripe_payment_intent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "products_slug_idx";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "currency" SET DEFAULT 'usd';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "tagline";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "price_cent";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "stock";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "featured";