import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { getPublicDrugs } from "../services/public.api";

const Shop = ({ searchTerm }) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState(["All"]);

  const query = useMemo(
    () => ({
      page: Number(params.get("page") || 1),
      q: params.get("q") ?? searchTerm ?? "",
      category: params.get("category") || "All",
    }),
    [params, searchTerm]
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPublicDrugs({
        page: query.page,
        limit: 12,
        q: query.q || undefined,
        category: query.category !== "All" ? query.category : undefined,
      });
      const nextItems = data.items || [];
      setItems(nextItems);
      setMeta(data.meta || null);
      const discovered = new Set(["All"]);
      nextItems.forEach((drug) => {
        if (drug.category) discovered.add(drug.category);
      });
      setCategories(Array.from(discovered));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query.page, query.q, query.category]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === "All") next.delete(key);
      else next.set(key, String(value));
    });
    if (updates.page === undefined) next.set("page", "1");
    setParams(next);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:pt-24">
      <h1 className="text-3xl md:text-5xl font-bold">Shop</h1>
      <p className="text-gray-600 mt-2">Discover medicines from real pharmacy inventory.</p>

      <div className="bg-white border rounded-xl p-4 mt-6 space-y-3">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            value={query.q}
            onChange={(e) => updateParams({ q: e.target.value, page: 1 })}
            placeholder="Search medicine"
            className="w-full outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => updateParams({ category, page: 1 })}
              className={`px-3 py-1 rounded-full border ${query.category === category ? "bg-black text-white" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="mt-8">Loading products...</p>}

      {!loading && error && (
        <div className="mt-8 border border-red-200 bg-red-50 text-red-700 rounded-lg p-4">
          <p>{error}</p>
          <button onClick={load} className="underline mt-2">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-8 border rounded p-6 bg-white">No products found.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {items.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <img
                  src={product.imageUrl || "https://placehold.co/600x400?text=Drug"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs bg-gray-100 inline-block px-2 py-1 rounded">{product.category || "General"}</p>
                  <h3 className="font-semibold text-lg mt-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description || "No description available."}</p>
                  <p className="text-teal-600 font-bold mt-3">{Number(product.price).toLocaleString()} FCFA</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/drug/${product.id}/pharmacies`)}
                      className="flex-1 border rounded py-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        addToCart(
                          {
                            id: product.id,
                            name: product.name,
                            price: Number(product.price),
                            src: product.imageUrl || "https://placehold.co/600x400?text=Drug",
                            category: product.category || "General",
                            prescriptionRequired: Boolean(product.prescriptionRequired),
                            pharmacyId: product.pharmacyId,
                            pharmacyName: product.Pharmacy?.name,
                          },
                          1
                        );
                        setIsCartOpen(true);
                      }}
                      className="flex-1 bg-teal-600 text-white rounded py-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              disabled={!meta?.hasPrev}
              onClick={() => updateParams({ page: Math.max(1, query.page - 1) })}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <p>
              Page {meta?.page || 1} of {meta?.totalPages || 1}
            </p>
            <button
              disabled={!meta?.hasNext}
              onClick={() => updateParams({ page: query.page + 1 })}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;
