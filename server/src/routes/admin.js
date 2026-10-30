
import { Router } from "express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { auth } from "../auth.js";
import { db } from "../db/index.js";
import { randomUUID } from "node:crypto";
import { user, products, bookings, orders, galleryItems } from "../db/schema.js";

export const adminRouter = Router();

// verify that the applicant is the manager specified in.env
async function requireAdmin(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You must log in first.",
      });
    }

    const adminUserId = process.env.ADMIN_USER_ID;

    if (!adminUserId || session.user.id !== adminUserId) {
      return res.status(403).json({
        success: false,
        message: "You do not have administrative privileges.",
      });
    }

    req.admin = session.user;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying permissions.",
    });
  }
}

// Display users with search functionality and pagination
adminRouter.get("/users", requireAdmin, async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );
    const offset = (page - 1) * limit;

    const searchCondition = search
      ? or(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`)
        )
      : undefined;

    const conditions = searchCondition ? [searchCondition] : [];

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        banExpires: user.banExpires,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);

    return res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        hasMore: users.length === limit,
      },
    });
  } catch (error) {
    console.error("Get admin users error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load users",
    });
  }
});

// حظر مستخدم
adminRouter.patch("/users/:id/ban", requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const reason = String(req.body.reason || "Violation of Terms of Use").trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (userId === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot block your administrative account.",
      });
    }

    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!existingUser.length) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    await db
      .update(user)
      .set({
        banned: true,
        banReason: reason,
        banExpires: null,
      })
      .where(eq(user.id, userId));

    return res.json({
      success: true,
      message: "The user has been successfully blocked.",
    });
  } catch (error) {
    console.error("Ban user error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to block the user",
    });
  }
});

// Unblock a user
adminRouter.patch("/users/:id/unban", requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!existingUser.length) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    await db
      .update(user)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
      })
      .where(eq(user.id, userId));

    return res.json({
      success: true,
      message: "The user has been successfully unblocked.",
    });
  } catch (error) {
    console.error("Unban user error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to unblock the user",
    });
  }
});


// Get all products, including inactive products
adminRouter.get("/products", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    return res.json({
      success: true,
      products: rows.map((product) => ({
        ...product,
        price: product.priceCents / 100,
      })),
    });
  } catch (error) {
    console.error("Get admin products error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load products.",
    });
  }
});

// Add a new product
adminRouter.post("/products", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      currency,
      imageUrl,
    } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof imageUrl !== "string" ||
      !imageUrl.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields.",
      });
    }

    const numericPrice = Number(price);
    const priceCents = Math.round(numericPrice * 100);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !Number.isSafeInteger(priceCents)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid product price.",
      });
    }

    const productCurrency =
      typeof currency === "string" && currency.trim()
        ? currency.trim().toLowerCase()
        : "usd";

    const [newProduct] = await db
      .insert(products)
      .values({
        id: randomUUID(),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        priceCents,
        currency: productCurrency,
        imageUrl: imageUrl.trim(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: {
        ...newProduct,
        price: newProduct.priceCents / 100,
      },
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create product.",
    });
  }
});

// Update an existing product
adminRouter.patch("/products/:id", requireAdmin, async (req, res) => {
  try {
    const productId = req.params.id;

    const {
      name,
      category,
      description,
      price,
      currency,
      imageUrl,
      isActive,
    } = req.body ?? {};

    const updates = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name is required.",
        });
      }
      updates.name = name.trim();
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product category is required.",
        });
      }
      updates.category = category.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product description is required.",
        });
      }
      updates.description = description.trim();
    }

    if (price !== undefined) {
      const numericPrice = Number(price);
      const priceCents = Math.round(numericPrice * 100);

      if (
        !Number.isFinite(numericPrice) ||
        numericPrice <= 0 ||
        !Number.isSafeInteger(priceCents)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid product price.",
        });
      }

      updates.priceCents = priceCents;
    }

    if (currency !== undefined) {
      if (typeof currency !== "string" || !currency.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid currency.",
        });
      }
      updates.currency = currency.trim().toLowerCase();
    }

    if (imageUrl !== undefined) {
      if (typeof imageUrl !== "string" || !imageUrl.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid image URL.",
        });
      }
      updates.imageUrl = imageUrl.trim();
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Invalid product status.",
        });
      }
      updates.isActive = isActive;
    }

    const [updatedProduct] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, productId))
      .returning();

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully.",
      product: {
        ...updatedProduct,
        price: updatedProduct.priceCents / 100,
      },
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update product.",
    });
  }
});

// Deactivate a product instead of permanently deleting it
adminRouter.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const [updatedProduct] = await db
      .update(products)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(products.id, req.params.id))
      .returning();

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.json({
      success: true,
      message: "Product deactivated successfully.",
    });
  } catch (error) {
    console.error("Deactivate product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to deactivate product.",
    });
  }
});

adminRouter.get("/bookings", requireAdmin, async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;

    const conditions = [];

    if (search.trim()) {
      const searchPattern = `%${search.trim()}%`;

      conditions.push(
        or(
          ilike(bookings.customerName, searchPattern),
          ilike(bookings.email, searchPattern),
          ilike(bookings.service, searchPattern)
        )
      );
    }

    if (["pending", "confirmed", "cancelled"].includes(status)) {
      conditions.push(eq(bookings.bookingStatus, status));
    }

    const rows = await db
      .select()
      .from(bookings)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(bookings.createdAt));

    res.json({
      success: true,
      bookings: rows.map((booking) => ({
        ...booking,
        amount: booking.amountCents / 100,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    });
  }
});

adminRouter.patch("/bookings/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const existingBooking = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(eq(bookings.id, req.params.id))
      .limit(1);

    if (existingBooking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    await db
      .update(bookings)
      .set({
        bookingStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, req.params.id));

    res.json({
      success: true,
      message: "Booking status updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
    });
  }
});

adminRouter.get("/orders", requireAdmin, async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;
    const conditions = [];

    if (search.trim()) {
      const pattern = `%${search.trim()}%`;

      conditions.push(
        or(
          ilike(orders.customerName, pattern),
          ilike(orders.customerEmail, pattern),
          ilike(orders.customerPhone, pattern)
        )
      );
    }

    if (
      ["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        status
      )
    ) {
      conditions.push(eq(orders.orderStatus, status));
    }

    const rows = await db
      .select()
      .from(orders)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(orders.createdAt));

    res.json({
      success: true,
      orders: rows.map((order) => ({
        ...order,
        amount: order.amountCents / 100,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
});

adminRouter.patch("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const existingOrder = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.id, req.params.id))
      .limit(1);

    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    await db
      .update(orders)
      .set({
        orderStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, req.params.id));

    res.json({
      success: true,
      message: "Order status updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
});


adminRouter.get("/gallery", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(galleryItems)
      .orderBy(desc(galleryItems.createdAt));

    res.json({
      success: true,
      items: rows,
    });
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery items.",
    });
  }
});

adminRouter.post("/gallery", requireAdmin, async (req, res) => {
  try {
    const { title, imageUrl, category, alt, layoutClass } = req.body;

    if (
      !title?.trim() ||
      !imageUrl?.trim() ||
      !category?.trim() ||
      !alt?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(imageUrl.trim());
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid image URL.",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Image URL must use HTTP or HTTPS.",
      });
    }

    const [newItem] = await db
      .insert(galleryItems)
      .values({
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        category: category.trim(),
        alt: alt.trim(),
        layoutClass: layoutClass?.trim() || "small",
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Gallery item added successfully.",
      item: newItem,
    });
  } catch (error) {
    console.error("Failed to add gallery item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add gallery item.",
    });
  }
});

adminRouter.patch("/gallery/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID.",
      });
    }

    const { title, imageUrl, category, alt, layoutClass } = req.body;

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty.",
        });
      }
      updates.title = title.trim();
    }

    if (imageUrl !== undefined) {
      if (typeof imageUrl !== "string" || !imageUrl.trim()) {
        return res.status(400).json({
          success: false,
          message: "Image URL cannot be empty.",
        });
      }

      try {
        const parsedUrl = new URL(imageUrl.trim());

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid HTTP or HTTPS image URL.",
        });
      }

      updates.imageUrl = imageUrl.trim();
    }

    for (const field of ["category", "alt", "layoutClass"]) {
      if (req.body[field] !== undefined) {
        if (
          typeof req.body[field] !== "string" ||
          !req.body[field].trim()
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} cannot be empty.`,
          });
        }

        updates[field] = req.body[field].trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes were provided.",
      });
    }

    const [updatedItem] = await db
      .update(galleryItems)
      .set(updates)
      .where(eq(galleryItems.id, id))
      .returning();

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found.",
      });
    }

    res.json({
      success: true,
      message: "Gallery item updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Failed to update gallery item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update gallery item.",
    });
  }
});

adminRouter.delete("/gallery/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID.",
      });
    }

    const [deletedItem] = await db
      .delete(galleryItems)
      .where(eq(galleryItems.id, id))
      .returning({ id: galleryItems.id });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found.",
      });
    }

    res.json({
      success: true,
      message: "Gallery item deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item.",
    });
  }
});


adminRouter.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [
      usersCount,
      productsCount,
      bookingsCount,
      pendingBookingsCount,
      ordersCount,
      pendingOrdersCount,
      galleryCount,
    ] = await Promise.all([
      db.select({ count: sql`count(*)::int` }).from(user),

      db.select({ count: sql`count(*)::int` }).from(products),

      db.select({ count: sql`count(*)::int` }).from(bookings),

      db
        .select({ count: sql`count(*)::int` })
        .from(bookings)
        .where(eq(bookings.bookingStatus, "pending")),

      db.select({ count: sql`count(*)::int` }).from(orders),

      db
        .select({ count: sql`count(*)::int` })
        .from(orders)
        .where(eq(orders.orderStatus, "pending")),

      db.select({ count: sql`count(*)::int` }).from(galleryItems),
    ]);

    res.json({
      success: true,
      stats: {
        users: usersCount[0].count,
        products: productsCount[0].count,
        bookings: bookingsCount[0].count,
        pendingBookings: pendingBookingsCount[0].count,
        orders: ordersCount[0].count,
        pendingOrders: pendingOrdersCount[0].count,
        galleryImages: galleryCount[0].count,
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard statistics:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
});
