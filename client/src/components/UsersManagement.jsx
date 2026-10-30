
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search,
        page: String(page),
        limit: "10",
      });

      const response = await fetch(
        `${API_URL}/api/admin/users?${params}`,
        { credentials: "include" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load users.");
      }

      setUsers(data.users || []);
      setHasMore(data.pagination?.hasMore || false);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function changeBanStatus(userId, isBanned) {
    const action = isBanned ? "unban" : "ban";

    let reason = "";

    if (!isBanned) {
      reason = window.prompt("Enter the reason for banning the user:");

      if (reason === null) return;

      reason = reason.trim();

      if (!reason) {
        window.alert("Please provide a reason for the ban.");
        return;
      }
    }

    const confirmed = window.confirm(
      isBanned
        ? "Are you sure you want to unban this user?"
        : "Are you sure you want to ban this user?"
    );

    if (!confirmed) return;

    setBusyId(userId);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "The operation failed.");
      }

      await loadUsers();
      window.alert(data.message || "Operation completed successfully.");
    } catch (err) {
      window.alert(err.message || "An unexpected error occurred.");
    } finally {
      setBusyId(null);
    }
  }

  
return (
  <section className="mt-8 w-full text-left" dir="ltr">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          User Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          View and manage registered user accounts.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-amber-600"
        />

        <button
          onClick={loadUsers}
          disabled={loading}
          className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
    </div>

    {error && (
      <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">
        {error}
      </p>
    )}

    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      {loading ? (
        <p className="p-6 text-center text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="p-6 text-center text-gray-500">No users found.</p>
      ) : (
        <table className="w-full min-w-[750px] text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Registration Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">
                  {item.name || "Unknown"}
                </td>

                <td className="p-4 text-gray-600">{item.email}</td>

                <td className="p-4 text-gray-600">
                  {item.role || "user"}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.banned
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.banned ? "Banned" : "Active"}
                  </span>
                </td>

                <td className="p-4 text-gray-600">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US")
                    : "—"}
                </td>

                <td className="p-4">
                  <button
                    disabled={busyId === item.id}
                    onClick={() =>
                      changeBanStatus(item.id, item.banned)
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 ${
                      item.banned
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {busyId === item.id
                      ? "Processing..."
                      : item.banned
                        ? "Unban"
                        : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    <div className="mt-5 flex items-center justify-center gap-5">
      <button
        disabled={page === 1 || loading}
        onClick={() => setPage((current) => current - 1)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-40"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">Page {page}</span>

      <button
        disabled={!hasMore || loading}
        onClick={() => setPage((current) => current + 1)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </section>
);
}
