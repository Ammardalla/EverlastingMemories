
import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { products } from "../db/schema.js";

export const productsRouter = Router();

// GET /api/products
// Fetch active products and their prices from Neon
productsRouter.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let rows;

    if (!category || category === "All") {
      rows = await db
        .select()
        .from(products)
        .where(eq(products.isActive, true));
    } else {
      rows = await db
        .select()
        .from(products)
        .where(eq(products.category, category));
      
      rows = rows.filter((product) => product.isActive);
    }

    res.json(
      rows.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.priceCents / 100,
        currency: product.currency,
        image: product.imageUrl,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});
