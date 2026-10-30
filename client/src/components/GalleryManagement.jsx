
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const emptyForm = {
  title: "",
  imageUrl: "",
  category: "",
  alt: "",
  layoutClass: "small",
};

export default function GalleryManagement() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/gallery`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load gallery items.");
      }

      setItems(data.items || []);
    } catch (err) {
      setError(err.message || "Unable to load gallery items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startEditing(item) {
    setEditingId(item.id);

    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category,
      alt: item.alt,
      layoutClass: item.layoutClass,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing
          ? `${API_URL}/api/admin/gallery/${editingId}`
          : `${API_URL}/api/admin/gallery`,
        {
          method: isEditing ? "PATCH" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save gallery item.");
      }

      resetForm();
      await loadItems();
      window.alert(data.message);
    } catch (err) {
      setError(err.message || "Unable to save gallery item.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/admin/gallery/${item.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete gallery item.");
      }

      if (editingId === item.id) {
        resetForm();
      }

      await loadItems();
      window.alert(data.message);
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Photo Gallery Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, and manage your website gallery images.
          </p>
        </div>

        <button
          onClick={loadItems}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {editingId !== null ? "Edit Gallery Image" : "Add New Image"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter the image details below.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Image Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter image title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              placeholder="For example: Wedding"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Alternative Text
            </label>
            <input
              name="alt"
              value={form.alt}
              onChange={handleChange}
              required
              placeholder="Describe the image"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Image Layout
            </label>
            <select
              name="layoutClass"
              value={form.layoutClass}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-amber-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="wide">Wide</option>
              <option value="tall">Tall</option>
            </select>
          </div>
        </div>

        {form.imageUrl && (
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Image Preview
            </p>
            <img
              src={form.imageUrl}
              alt={form.alt || "Gallery preview"}
              className="h-48 w-full rounded-xl border border-gray-200 object-cover sm:w-80"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId !== null
                ? "Save Changes"
                : "Add Image"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </form>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Gallery Images
          </h3>
          <span className="text-sm text-gray-500">
            {items.length} image(s)
          </span>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Loading gallery...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            No gallery images found.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <img
                  src={item.imageUrl}
                  alt={item.alt}
                  className="h-52 w-full bg-gray-100 object-cover"
                  loading="lazy"
                />

                <div className="space-y-3 p-4">
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.category} · {item.layoutClass}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(item)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteItem(item)}
                      className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
