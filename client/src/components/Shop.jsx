
import { useSession } from "../lib/auth-client";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://everlastingmemories.onrender.com";

const categories = ["ALL", "PRINTS", "ALBUMS", "KEEPSAKES"];

function Shop() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("featured");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const { data: session, isPending: sessionLoading } = useSession();
  const isLoggedIn = Boolean(session?.user?.id);

  const getItemPrice = (item) => {
  const originalPrice = Math.round(Number(item.price) * 100);

  if (sessionLoading || !isLoggedIn) {
    return originalPrice / 100;
  }

  return Math.round(originalPrice * 90 / 100) / 100;
};

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const response = await fetch(`${API_BASE_URL}/api/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid products response.");
        }

        setProducts(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load products:", error);
          setProductsError("Unable to load products. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === "ALL"
        ? [...products]
        : products.filter(
            (product) => product.category === activeCategory
          );

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategory, sortBy]);

  const addToCart = (product, quantity) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentCart, { ...product, quantity }];
    });

    setCartOpen(true);
  };

  const updateCartQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

const cartTotal = cart.reduce(
  (total, item) => total + getItemPrice(item) * item.quantity,
  0
);

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (cart.length === 0 || checkoutLoading) return;

    const name = customerName.trim();
    const email = customerEmail.trim();
    const phone = customerPhone.trim();
    const address = customerAddress.trim();

    if (
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      phone.length < 5 ||
      address.length < 5
    ) {
      setCheckoutError(
        "Please enter your full name, a valid email, phone number, and delivery address."
      );
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError("");

      const response = await fetch(
        `${API_BASE_URL}/api/products/checkout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerAddress: address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to start checkout. Please try again."
        );
      }

      if (!data.checkoutUrl) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError(
        error.message || "Something went wrong. Please try again."
      );
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-black)] text-[var(--color-white)]">
      <div className="px-[8%] pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-taupe)] transition-colors hover:text-[var(--color-gold)]"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>
      </div>

      <main>
        <section className="px-[8%] pb-12 pt-20 text-center sm:pb-16 sm:pt-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
            The Everlasting Collection
          </p>

          <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-tight">
            Shop Our
            <span className="block text-[var(--color-orange)]">
              Collection.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[var(--color-taupe)] sm:text-base">
            Discover beautiful prints, timeless albums, and meaningful
            keepsakes made to bring your favorite memories to life.
          </p>

          <div className="mx-auto mt-8 h-px w-20 bg-[var(--color-gold)]" />
        </section>

        <section className="px-[8%] pb-10">
          <div className="flex flex-col gap-6 border-b border-[rgba(168,149,132,0.25)] pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="flex flex-wrap gap-2"
              aria-label="Product categories"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`border px-5 py-3 text-xs font-semibold tracking-[0.12em] transition-all duration-300 ${
                    activeCategory === category
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-black)]"
                      : "border-[rgba(168,149,132,0.35)] text-[var(--color-taupe)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="shop-sort"
                className="shrink-0 text-xs uppercase tracking-[0.12em] text-[var(--color-taupe)]"
              >
                Sort by
              </label>

              <select
                id="shop-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="min-h-11 min-w-0 flex-1 border border-[rgba(168,149,132,0.35)] bg-[var(--color-black)] px-3 text-sm text-[var(--color-white)] outline-none focus:border-[var(--color-gold)] sm:flex-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-6">
            <p className="text-sm text-[var(--color-taupe)]">
              Showing{" "}
              <span className="text-[var(--color-white)]">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 border border-[var(--color-gold)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-black)]"
            >
              <span aria-hidden="true">♧</span>
              Cart ({cartCount})
            </button>
          </div>
        </section>

        <section className="px-[8%] pb-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
            {loadingProducts ? (
              <p className="col-span-full py-20 text-center text-[var(--color-taupe)]">
                Loading products...
              </p>
            ) : productsError ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-red-400">{productsError}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 border border-[var(--color-gold)] px-5 py-3 text-sm text-[var(--color-gold)]"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="col-span-full py-20 text-center text-[var(--color-taupe)]">
                No products found in this category.
              </p>
            ) : (
              filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isLoggedIn={isLoggedIn}
              />
              ))
            )}
          </div>
        </section>
      </main>

      <div className="my-2 flex flex-col items-start justify-between gap-2 border-t border-[rgba(168,149,132,0.2)] pt-6 min-[600px]:flex-row min-[600px]:items-center">
        <p className="m-2 text-[0.7rem] tracking-[0.03em] text-[var(--color-taupe)]">
          © 2026 Everlasting Memories. All rights reserved.
        </p>
        <p className="m-2 text-[0.7rem] tracking-[0.03em] text-[var(--color-taupe)]">
          Photography &amp; Visual Stories
        </p>
      </div>

      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/70"
          onClick={() => setCartOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-[rgba(168,149,132,0.3)] bg-[var(--color-black)] p-6 text-[var(--color-white)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[rgba(168,149,132,0.25)] pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
                  Your Selection
                </p>
                <h2 id="cart-title" className="mt-2 text-2xl font-medium">
                  Shopping Cart ({cartCount})
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping cart"
                className="p-2 text-2xl text-[var(--color-taupe)] hover:text-[var(--color-gold)]"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="text-lg">Your cart is empty.</p>
                <p className="mt-2 text-sm text-[var(--color-taupe)]">
                  Discover something special for your memories.
                </p>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="mt-6 border border-[var(--color-gold)] px-6 py-3 text-xs uppercase tracking-wider text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-black)]"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-[rgba(168,149,132,0.2)]">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 py-5">
<img
  src={
    /^https?:\/\//i.test(item.image || "")
      ? item.image
      : `${import.meta.env.BASE_URL}${(item.image || "")
          .replace(/^\/+/, "")
          .replace(/^EverlastingMemories\//, "")}`
  }
  alt={item.name}
  className="h-24 w-20 shrink-0 bg-[var(--color-espresso)] object-cover"
/>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium">{item.name}</h3>
<div className="mt-2 flex flex-wrap items-center gap-2">
  {isLoggedIn && !sessionLoading ? (
    <>
      <span className="text-sm text-red-400 line-through">
        ${Number(item.price).toFixed(2)}
      </span>

      <span className="text-sm font-semibold text-[var(--color-gold)]">
        ${getItemPrice(item).toFixed(2)}
      </span>

      <span className="text-xs text-green-400">
        discount 10%
      </span>
    </>
  ) : (
    <span className="text-sm text-[var(--color-gold)]">
      ${Number(item.price).toFixed(2)}
    </span>
  )}
</div>

                        <div className="mt-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)}
                            aria-label={`Remove one ${item.name}`}
                            className="h-8 w-8 border border-[rgba(168,149,132,0.35)] hover:border-[var(--color-gold)]"
                          >
                            −
                          </button>
                          <span className="text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)}
                            aria-label={`Add one ${item.name}`}
                            className="h-8 w-8 border border-[rgba(168,149,132,0.35)] hover:border-[var(--color-gold)]"
                          >
                            +
                          </button>
                        </div>
                      </div>

<p className="shrink-0 text-sm">
  ${(getItemPrice(item) * item.quantity).toFixed(2)}
</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCheckout} className="border-t border-[rgba(168,149,132,0.3)] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-taupe)]">
                      Subtotal
                    </span>
                    <span className="text-xl text-[var(--color-gold)]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[var(--color-taupe)]">
                    Shipping and any applicable taxes are calculated separately.
                  </p>

                  <div className="mt-5 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
                      Delivery Information
                    </h3>

                    <div>
                      <label htmlFor="customer-name" className="mb-1 block text-xs text-[var(--color-taupe)]">
                        Full Name *
                      </label>
                      <input
                        id="customer-name"
                        name="customerName"
                        type="text"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={120}
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                        placeholder="Your full name"
                        className="w-full border border-[rgba(168,149,132,0.35)] bg-transparent px-3 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
                      />
                    </div>

                    <div>
                      <label htmlFor="customer-email" className="mb-1 block text-xs text-[var(--color-taupe)]">
                        Email Address *
                      </label>
                      <input
                        id="customer-email"
                        name="customerEmail"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        value={customerEmail}
                        onChange={(event) => setCustomerEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-[rgba(168,149,132,0.35)] bg-transparent px-3 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
                      />
                    </div>

                    <div>
                      <label htmlFor="customer-phone" className="mb-1 block text-xs text-[var(--color-taupe)]">
                        Phone Number *
                      </label>
                      <input
                        id="customer-phone"
                        name="customerPhone"
                        type="tel"
                        autoComplete="tel"
                        required
                        minLength={5}
                        maxLength={40}
                        value={customerPhone}
                        onChange={(event) => setCustomerPhone(event.target.value)}
                        placeholder="+961 ..."
                        className="w-full border border-[rgba(168,149,132,0.35)] bg-transparent px-3 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
                      />
                    </div>

                    <div>
                      <label htmlFor="customer-address" className="mb-1 block text-xs text-[var(--color-taupe)]">
                        Delivery Address *
                      </label>
                      <textarea
                        id="customer-address"
                        name="customerAddress"
                        autoComplete="street-address"
                        required
                        minLength={5}
                        maxLength={500}
                        rows={3}
                        value={customerAddress}
                        onChange={(event) => setCustomerAddress(event.target.value)}
                        placeholder="Street, building, area, city..."
                        className="w-full resize-y border border-[rgba(168,149,132,0.35)] bg-transparent px-3 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
                      />
                    </div>
                  </div>

                  {checkoutError && (
                    <p role="alert" className="mt-4 text-sm text-red-400">
                      {checkoutError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={checkoutLoading || cart.length === 0}
                    className="mt-6 w-full border border-[var(--color-gold)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-black)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkoutLoading ? "Redirecting to Checkout..." : "Proceed to Checkout"}
                  </button>
                </form>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default Shop;
