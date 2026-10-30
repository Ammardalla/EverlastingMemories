
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMoney(amount, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ search, status });

      const response = await fetch(
        `${API_URL}/api/admin/bookings?${params}`,
        { credentials: "include" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load bookings.");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function updateStatus(bookingId, newStatus) {
    const confirmed = window.confirm(
      `Are you sure you want to change this booking status to ${newStatus}?`
    );

    if (!confirmed) return;

    setBusyId(bookingId);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update booking.");
      }

      await loadBookings();
      window.alert(data.message);
    } catch (err) {
      window.alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bookings Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage customer bookings.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customer, email, or service..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-amber-500"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-amber-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Booking Date</th>
                <th className="px-5 py-4">Package</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Booking Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {booking.customerName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {booking.email}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    {booking.service}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    {formatDate(booking.bookingDate)}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    <p>{booking.packageId}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {booking.photoCount} photos
                    </p>
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {formatMoney(booking.amount, booking.currency)}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                      {booking.paymentStatus}
                    </span>
                    <p className="mt-2 text-xs capitalize text-gray-500">
                      {booking.paymentMethod}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[booking.bookingStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={booking.bookingStatus}
                      disabled={busyId === booking.id}
                      onChange={(event) =>
                        updateStatus(booking.id, event.target.value)
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-gray-500">
        {bookings.length} booking(s) displayed.
      </p>
    </section>
  );
}
