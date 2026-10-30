
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatMoney(amount, currency = "usd") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount} ${currency.toUpperCase()}`;
  }
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getItemName(item) {
  if (typeof item === "string") return item;
  return item?.name || item?.title || item?.productName || "Product";
}

function getItemQuantity(item) {
  return item?.quantity || item?.qty || 1;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ search, status });

      const response = await fetch(
        `${API_URL}/api/admin/orders?${params}`,
        { credentials: "include" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function updateStatus(orderId, newStatus) {
    const confirmed = window.confirm(
      `Are you sure you want to change this order status to ${newStatus}?`
    );

    if (!confirmed) return;

    setBusyId(orderId);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
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
        throw new Error(data.message || "Unable to update order.");
      }

      await loadOrders();
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
            Orders Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View customer orders and manage their fulfillment status.
          </p>
        </div>

        <button
          onClick={loadOrders}
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
          placeholder="Search name, email, or phone..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-amber-500"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-amber-500"
        >
          <option value="all">All Statuses</option>
          {orderStatuses.map((value) => (
            <option key={value} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const expanded = expandedId === order.id;

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">
                      {order.customerName}
                    </p>
                    <p className="mt-1 break-all text-sm text-gray-500">
                      {order.customerEmail}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.customerPhone}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      Order ID: {order.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Order Date</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {formatMoney(order.amount, order.currency)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[order.paymentStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[order.orderStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setExpandedId(expanded ? null : order.id)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {expanded ? "Hide Details" : "View Details"}
                    </button>

                    <select
                      value={order.orderStatus}
                      disabled={busyId === order.id}
                      onChange={(event) =>
                        updateStatus(order.id, event.target.value)
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
                    >
                      {orderStatuses.map((value) => (
                        <option key={value} value={value}>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-3 font-semibold text-gray-900">
                          Customer Address
                        </h3>
                        <p className="whitespace-pre-wrap text-sm text-gray-600">
                          {order.customerAddress}
                        </p>
                      </div>

                      <div>
                        <h3 className="mb-3 font-semibold text-gray-900">
                          Order Items
                        </h3>

                        {items.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No item details available.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {items.map((item, index) => (
                              <li
                                key={item?.id || item?.productId || index}
                                className="flex justify-between gap-4 rounded-lg bg-white p-3 text-sm"
                              >
                                <span className="text-gray-700">
                                  {getItemName(item)}
                                  <span className="ml-2 text-gray-400">
                                    × {getItemQuantity(item)}
                                  </span>
                                </span>

                                {item?.price != null && (
                                  <span className="font-medium text-gray-900">
                                    {formatMoney(
                                      Number(item.price) *
                                        getItemQuantity(item),
                                      order.currency
                                    )}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <p className="text-sm text-gray-500">
        {orders.length} order(s) displayed.
      </p>
    </section>
  );
}
