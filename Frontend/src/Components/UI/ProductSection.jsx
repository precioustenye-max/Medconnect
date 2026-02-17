import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";
import ProductGrid from "./ProductGrid";
import { getPublicDrugs } from "../../services/public.api";

const ProductSection = ({ searchTerm }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPublicDrugs({ limit: 18, q: searchTerm || undefined });
        setProducts((data.items || []).map((item) => ({
          ...item,
          src: item.imageUrl || "https://placehold.co/600x400?text=Drug",
          category: item.category || "General",
          prescriptionRequired: Boolean(item.prescriptionRequired),
        })));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchTerm]);

  const categories = useMemo(() => {
    return ["All Products", ...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "All Products") {
      result = result.filter((p) => p.category === activeCategory);
    }
    return result;
  }, [products, activeCategory]);

  const displayedProducts = filteredProducts
  //  useMemo(() => {
  //   if (showAll) return filteredProducts;
  //   return filteredProducts.filter((p) => p.prescriptionRequired === true);
  // }, [filteredProducts, showAll]);

  return (
    <section className="px-2 md:px-10 py-8 md:16 relative">
      <h2 className="text-3xl md:text-4xl font-semibold md:mb-8 mb-3">Shop by Category</h2>

      <CategoryFilter categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />

      {loading && <p>Loading products...</p>}
      {!loading && error && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {error}
        </div>
      )}
      {!loading && !error && displayedProducts.length === 0 && (
        <div className="border rounded p-4 bg-white">No products found.</div>
      )}
      {!loading && !error && displayedProducts.length > 0 && (
        <ProductGrid products={displayedProducts} onSelect={(product) => navigate(`/drug/${product.id}/pharmacies`)} />
      )}

      {!showAll && filteredProducts.length > displayedProducts.length && (
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-black text-white rounded-md hover:opacity-90" onClick={() => setShowAll(true)}>
            See more
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductSection;
