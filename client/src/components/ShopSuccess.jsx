
import { Link, useSearchParams } from "react-router-dom";

function ShopSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-black)] px-6 py-16 text-[var(--color-white)]">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-gold)] text-4xl text-[var(--color-gold)]">
          ✓
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
          Everlasting Memories
        </p>

        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          Thank You for Your Order!
        </h1>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[var(--color-taupe)]">
          Thank you for shopping with us. Your checkout has
          returned successfully. We are checking your order
          confirmation.
        </p>

        {orderId && (
          <p className="mt-5 break-all text-xs text-[var(--color-taupe)]">
            Order reference: {orderId}
          </p>
        )}

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center border border-[var(--color-gold)] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-black)]"
        >
          Back to Home
        </Link>

        <div>
          <Link
            to="/shop"
            className="mt-5 inline-block text-sm text-[var(--color-taupe)] hover:text-[var(--color-gold)]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ShopSuccess;
