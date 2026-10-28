
import "dotenv/config";
import { db } from "./index.js";
import { galleryItems } from "./gallery.data.js";
import {
  galleryItems as galleryItemsTable,
  products as productsTable,
} from "./schema.js";

const shopProducts = [
  {
    id: "classic-photo-prints",
    name: "Classic Photo Prints",
    category: "PRINTS",
    description: "High-quality prints that bring your favorite moments to life.",
    priceCents: 1299,
    imageUrl: "/images/classic-prints.jpg",
  },
  {
    id: "fine-art-prints",
    name: "Fine Art Prints",
    category: "PRINTS",
    description: "Elegant fine art prints with beautiful detail and rich tones.",
    priceCents: 1999,
    imageUrl: "/images/fine-art-prints.jpg",
  },
  {
    id: "framed-photo-print-1",
    name: "Framed Photo Print",
    category: "PRINTS",
    description: "A timeless framed photograph, ready to display and cherish.",
    priceCents: 2999,
    imageUrl: "/images/framed-printed.jpg",
  },
  {
    id: "framed-photo-print-2",
    name: "Framed Photo Print",
    category: "PRINTS",
    description: "A timeless framed photograph for fields and roses, ready to display and cherish.",
    priceCents: 2999,
    imageUrl: "/images/framed-print.jpg",
  },
  {
    id: "classic-memory-album",
    name: "Classic Memory Album",
    category: "ALBUMS",
    description: "A beautiful album for keeping your most treasured memories.",
    priceCents: 3499,
    imageUrl: "/images/classic-album.jpg",
  },
  {
    id: "premium-wedding-album",
    name: "Premium Wedding Album",
    category: "ALBUMS",
    description: "An elegant album designed for life's most special celebrations.",
    priceCents: 5999,
    imageUrl: "/images/wedding-album.jpg",
  },
  {
    id: "travel-memories-album-1",
    name: "Travel Memories Album",
    category: "ALBUMS",
    description: "Keep your favorite adventures together in one special place.",
    priceCents: 4499,
    imageUrl: "/images/travel-album.jpg",
  },
  {
    id: "travel-memories-album-2",
    name: "Travel Memories Album",
    category: "ALBUMS",
    description: "Keep your favorite adventures together in one special place.",
    priceCents: 4499,
    imageUrl: "/images/children-album.jpg",
  },
  {
    id: "memory-keepsake-box",
    name: "Memory Keepsake Box",
    category: "KEEPSAKES",
    description: "A thoughtful box for photographs and meaningful little treasures.",
    priceCents: 2499,
    imageUrl: "/images/keepsake-box.jpg",
  },
  {
    id: "personalized-photo-gift",
    name: "Personalized Photo Gift",
    category: "KEEPSAKES",
    description: "A personal gift that turns a favorite moment into a lasting memory.",
    priceCents: 1799,
    imageUrl: "/images/photo-gift.jpg",
  },
  {
    id: "memory-gift-set-1",
    name: "Memory Gift Set",
    category: "KEEPSAKES",
    description: "A curated set of keepsakes made for meaningful occasions.",
    priceCents: 3999,
    imageUrl: "/images/memory-gift-set.jpg",
  },
  {
    id: "memory-gift-set-2",
    name: "Memory Gift Set",
    category: "KEEPSAKES",
    description: "A curated set of keepsakes made for meaningful occasions.",
    priceCents: 3999,
    imageUrl: "/images/memory-gift-set2.jpg",
  },
];

async function seedGallery() {
  const items = galleryItems.map(
    ({ title, imageUrl, alt, category, layoutClass }) => ({
      title,
      imageUrl,
      alt,
      category,
      layoutClass,
    })
  );

  await db.insert(galleryItemsTable).values(items);

  console.log("Gallery items seeded successfully.");
}

async function seedProducts() {
  for (const item of shopProducts) {
    await db
      .insert(productsTable)
      .values(item)
      .onConflictDoUpdate({
        target: productsTable.id,
        set: {
          name: item.name,
          category: item.category,
          description: item.description,
          priceCents: item.priceCents,
          currency: "usd",
          imageUrl: item.imageUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });
  }

  console.log("Shop products seeded successfully.");
}

async function seed() {
  try {
    await seedGallery();
    await seedProducts();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await db.$client.end();
  }
}

seed();
