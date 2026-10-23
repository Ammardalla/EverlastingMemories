
import "dotenv/config";
import { db } from "./index.js";
import { galleryItems } from "./gallery.data.js";
import { galleryItems as galleryItemsTable } from "./schema.js";

async function seedGallery() {
  try {
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
  } catch (error) {
    console.error("Failed to seed gallery items:", error);
    process.exitCode = 1;
  } finally {
    await db.$client.end();
  }
}

seedGallery();
