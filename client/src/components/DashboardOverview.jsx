
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const cards = [
  {
    key: "users",
    title: "Total Users",
    icon: "♙",
    color: "bg-blue-50 text-blue-700",
  },
  {
    key: "products",
    title: "Total Products",
    icon: "▣",
    color: "bg-purple-50 text-purple-700",
  },
  {
    key: "bookings",
    title: "Total Bookings",
    icon: "▦",
    color: "bg-amber-50 text-amber-700",
  },
  {
    key: "orders",
    title: "Total Orders",
    icon: "▤",
    color: "bg-green-50 text-green-700",
  },
  {
    key: "galleryImages",
    title: "Gallery Images",
    icon: "▧",
    color: "bg-pink-50 text-pink-700",
  },
];

export default function DashboardOverview({ admin, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load dashboard statistics.");
      }

      setStats(data.stats);
    } catch (err) {
      setError(err.message || "Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {admin?.name || "Administrator"}.
            Here is your website overview.
          </p>
        </div>

        <button
          onClick={loadStats}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Statistics"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${card.color}`}
              >
                {card.icon}
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              {loading ? "..." : (stats?.[card.key] ?? 0).toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900">Pending Bookings</h3>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {loading ? "..." : (stats?.pendingBookings ?? 0).toLocaleString("en-US")}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Bookings waiting for confirmation.
          </p>
          <button
            onClick={() => onNavigate("bookings")}
            className="mt-5 text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            Manage Bookings →
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900">Pending Orders</h3>
          <p className="mt-3 text-3xl font-bold text-blue-600">
            {loading ? "..." : (stats?.pendingOrders ?? 0).toLocaleString("en-US")}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Orders waiting for processing.
          </p>
          <button
            onClick={() => onNavigate("orders")}
            className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            Manage Orders →
          </button>
        </div>
      </div>
    </section>
  );
}
