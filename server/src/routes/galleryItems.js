
import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { galleryItems } from "../db/schema.js";

export const galleryRouter = Router();

galleryRouter.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let rows;

    if (!category || category === "All") {
      rows = await db.select().from(galleryItems);
    } else {
      rows = await db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.category, category));
    }

    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);

    res.status(500).json({
      message: "Failed to fetch gallery items",
    });
  }
});
