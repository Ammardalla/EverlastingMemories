
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersManagement from "../components/UsersManagement";
import ProductsManagement from "../components/ProductsManagement";
import BookingsManagement from "../components/BookingsManagement";
import OrdersManagement from "../components/OrdersManagement";
import GalleryManagement from "../components/GalleryManagement";
import DashboardOverview from "../components/DashboardOverview";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const sections = [
  { id: "home", label: "Dashboard", icon: "⌂" },
  { id: "users", label: "Users", icon: "♙" },
  { id: "products", label: "Products", icon: "▣" },
  { id: "bookings", label: "Bookings", icon: "▦" },
  { id: "orders", label: "Orders", icon: "▤" },
  { id: "gallery", label: "Photo Gallery", icon: "▧" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch(`${API_URL}/api/admin/check`, {
          credentials: "include",
        });

        const data = await response.json();

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        if (response.status === 403) {
          setError("You do not have permission to access the control panel.");
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "An error occurred during verification."
          );
        }

        setAdmin(data.user);
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-600">
          Verifying your permissions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-4xl">🔒</div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            Access Denied
          </h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentSection = sections.find(
    (section) => section.id === activeSection
  );

  function renderSection() {
    switch (activeSection) {
      case "users":
        return <UsersManagement />;

      case "products":
        return <ProductsManagement />;

case "home":
  return (
    <DashboardOverview
      admin={admin}
      onNavigate={setActiveSection}
    />
  );

case "bookings":
  return <BookingsManagement />;

case "orders":
  return <OrdersManagement />;

case "gallery":
  return <GalleryManagement />;

      case "settings":
        return (
          <Placeholder
            title="Settings"
            description="Administration settings will be available here."
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 md:flex" dir="ltr">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-gray-950 text-white transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-6 py-7">
          <h2 className="text-xl font-bold tracking-wide">
            Everlasting Memories
          </h2>
          <p className="mt-2 text-sm text-gray-400">Administration Panel</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Main Menu
          </p>

          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activeSection === section.id
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-lg">
                {section.icon}
              </span>
              {section.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to Website
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Open navigation"
            >
              ☰
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {currentSection?.label || "Dashboard"}
              </h1>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Everlasting Memories Administration
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {admin?.name}
              </p>
              <p className="text-xs text-gray-500">{admin?.email}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Dashboard / {currentSection?.label || "Dashboard"}
            </p>
          </div>

          {renderSection()}
        </main>
      </div>
    </div>
  );
}

function Placeholder({ title, description }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-3 text-gray-500">{description}</p>
      <span className="mt-6 inline-flex rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
        Coming Soon
      </span>
    </div>
  );
}

export default AdminDashboard;
