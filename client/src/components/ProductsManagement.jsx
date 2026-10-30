
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  currency: "usd",
  imageUrl: "",
};

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/products`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load products.");
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  function editProduct(product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      currency: product.currency,
      imageUrl: product.imageUrl,
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/api/admin/products/${editingId}`
        : `${API_URL}/api/admin/products`;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save product.");
      }

      setMessage(data.message || "Product saved successfully.");
      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleProduct(product) {
    const action = product.isActive ? "deactivate" : "activate";

    if (
      !window.confirm(
        product.isActive
          ? "Are you sure you want to deactivate this product?"
          : "Are you sure you want to activate this product?"
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/products/${product.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !product.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Unable to ${action} product.`);
      }

      setMessage(data.message);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to update product status.");
    }
  }

  return (
    <section className="mt-8 w-full text-left" dir="ltr">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Products Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add, edit, and manage your shop products.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h3 className="mb-5 text-lg font-semibold text-gray-800">
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
          />

          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
          />

          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
            <option value="lbp">LBP</option>
          </select>

          <input
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL (https://...)"
            required
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600 md:col-span-2"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product Description"
            rows={4}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-600 md:col-span-2"
          />
        </div>

        {form.imageUrl && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-gray-500">Image Preview</p>
            <img
              src={form.imageUrl}
              alt="Product preview"
              className="h-32 w-32 rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Product"
                : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="mb-4 rounded-lg bg-green-50 p-3 text-green-700">
          {message}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-center text-gray-500">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No products found.
          </p>
        ) : (
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  </td>

                  <td className="p-4 font-medium text-gray-800">
                    {product.name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {product.category}
                  </td>

                  <td className="p-4 text-gray-600">
                    {product.price} {product.currency.toUpperCase()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => toggleProduct(product)}
                        className={`rounded-lg px-3 py-2 text-xs text-white ${
                          product.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
