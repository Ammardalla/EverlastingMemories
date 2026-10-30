
import { useState } from "react";

const DISCOUNT_PERCENT = 10;

function ProductCard({ product, onAddToCart, isLoggedIn = false }) {
  const [quantity, setQuantity] = useState(1);

  const originalCents = Math.round(Number(product.price) * 100);
  const discountedCents = Math.round(
    (originalCents * (100 - DISCOUNT_PERCENT)) / 100
  );

  const originalPrice = originalCents / 100;
  const discountedPrice = discountedCents / 100;
  const displayPrice = isLoggedIn ? discountedPrice : originalPrice;

  // Build the correct image URL for GitHub Pages
  const imagePath = (product.image || "").replace(/^\/+/, "");

  const imageUrl = /^https?:\/\//i.test(imagePath)
    ? imagePath
    : `${import.meta.env.BASE_URL}${imagePath.replace(
        /^EverlastingMemories\//,
        ""
      )}`;

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[rgba(168,149,132,0.25)] bg-[var(--color-black)] text-[var(--color-white)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-espresso)]">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 bg-[var(--color-black)]/80 px-3 py-2 text-[10px] tracking-[0.16em] text-[var(--color-gold)]">
          {product.category}
        </span>

        {isLoggedIn && (
          <span className="absolute right-4 top-4 bg-[var(--color-gold)] px-3 py-2 text-[10px] font-semibold tracking-wider text-[var(--color-black)]">
            10% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-medium leading-snug">
          {product.name}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-taupe)]">
          {product.description}
        </p>

        <div className="mt-5 border-t border-[rgba(168,149,132,0.25)] pt-5">
          <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-taupe)]">
            Price
          </span>

          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            {isLoggedIn && (
              <span className="text-base text-red-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}

            <span className="text-2xl font-medium text-[var(--color-gold)]">
              ${displayPrice.toFixed(2)}
            </span>
          </div>

          {isLoggedIn && (
            <p className="mt-2 text-xs text-[var(--color-taupe)]">
              You save ${(originalCents - discountedCents) / 100} per item
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--color-taupe)]">
            Quantity
          </span>

          <div className="flex items-center border border-[rgba(168,149,132,0.35)]">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity === 1}
              aria-label={`Decrease quantity of ${product.name}`}
              className="flex h-10 w-10 items-center justify-center text-lg transition-colors hover:bg-[var(--color-espresso)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>

            <span
              aria-live="polite"
              className="min-w-10 text-center text-sm tabular-nums"
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              aria-label={`Increase quantity of ${product.name}`}
              className="flex h-10 w-10 items-center justify-center text-lg transition-colors hover:bg-[var(--color-espresso)]"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product, quantity)}
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 border border-[var(--color-gold)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)] transition-all duration-300 hover:bg-[var(--color-gold)] hover:text-[var(--color-black)]"
        >
          <span>Add to Cart</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
