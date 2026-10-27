
import { Link, useSearchParams } from "react-router-dom";

function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-6 text-center text-white">
      <div className="max-w-lg">
        <div className="mb-6 text-5xl">✓</div>

        <h1 className="mb-4 text-3xl font-bold">
          Thank You for Your Booking!
        </h1>

        <p className="mb-6 text-gray-300">
          Thank you for choosing Everlasting Memories.
          We are checking your payment and booking details.
        </p>

        {bookingId && (
          <p className="mb-6 break-all text-sm text-gray-400">
            Booking reference: {bookingId}
          </p>
        )}

        <Link
          to="/"
          className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-950 hover:bg-gray-200"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}

export default BookingSuccess;
