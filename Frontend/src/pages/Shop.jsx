import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  /* ================= QUERY ================= */
  const query = useMemo(
    () => ({
      page: Number(params.get("page") || 1),
      q: params.get("q") ?? searchTerm ?? "",
      category: params.get("category") || "All",
    }),
    [params, searchTerm]
  );

  /* ================= LOAD ================= */
  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPublicDrugs({
        page: query.page,
        limit: 12,
        q: query.q || undefined,
        category:
          query.category !== "All" ? query.category : undefined,
      });

      let nextItems = data.items || [];

      // Price filter
      nextItems = nextItems.filter(
        (p) =>
          Number(p.price) >= priceRange[0] &&
          Number(p.price) <= priceRange[1]
      );

      // Prescription filter
      if (prescriptionOnly) {
        nextItems = nextItems.filter(
          (p) => p.prescriptionRequired
        );
      }

      // Sorting
      if (sort === "priceLow") {
        nextItems.sort((a, b) => a.price - b.price);
      }
      if (sort === "priceHigh") {
        nextItems.sort((a, b) => b.price - a.price);
      }
      if (sort === "popular") {
        nextItems.sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
      }

      setItems(nextItems);
      setMeta(data.meta || null);

      const discovered = new Set(["All"]);
      nextItems.forEach((drug) => {
        if (drug.category) discovered.add(drug.category);
      });
      setCategories(Array.from(discovered));
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query.page, query.q, query.category, priceRange, prescriptionOnly, sort]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "All") next.delete(key);
      else next.set(key, String(value));
    });
    setParams(next);
  };

  return (
    <div className="w-full bg-gray-50">

{/* ================= HERO (FULL HEIGHT + ANIMATED) ================= */}
<section className="relative w-full h-[85vh] md:h-[80vh] overflow-hidden">

  {/* Background Image with subtle zoom */}
  <motion.img
    src="/assets/pharmacy-1.jpg"
    alt="hero"
    initial={{ scale: 1.1 }}
    animate={{ scale: 1 }}
    transition={{ duration: 6, ease: "easeOut" }}
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-linear-to-r from-slate-900/85 via-slate-900/70 to-teal-900/60" />

  <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">

    {/* Animated Tag */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="uppercase tracking-wider text-sm bg-white/10 backdrop-blur px-4 py-1 rounded-full border border-white/20"
    >
      Government Verified Pharmacies • Secure Supply Chain
    </motion.p>

    {/* Main Title */}
    <motion.h1 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-6 text-4xl md:text-6xl font-bold max-w-4xl leading-tight"
    >
      Your Trusted Digital Marketplace For
      <span className="text-teal-400"> Authentic Medicines</span>
    </motion.h1>

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-4 max-w-2xl text-slate-200 text-sm md:text-lg"
    >
      Compare pharmacies. Check real-time availability.
      Order with confidence and fast delivery anywhere.
    </motion.p>

    {/* Animated Search */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-8 w-full max-w-2xl flex bg-white rounded-xl overflow-hidden shadow-2xl"
    >
      <input
        value={query.q}
        onChange={(e) =>
          updateParams({ q: e.target.value })
        }
        placeholder="Search medicines, brands, or symptoms..."
        className="flex-1 px-5 py-4 text-black outline-none text-sm md:text-base"
      />
      <button className="bg-teal-600 px-8 text-white font-medium hover:bg-teal-700 transition">
        Search
      </button>
    </motion.div>

    {/* Trust Badges */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-200"
    >
      <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
        ✔ Verified Pharmacies
      </span>
      <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
        ✔ Prescription Compliance
      </span>
      <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
        ✔ Secure Checkout
      </span>
    </motion.div>

    {/* Scroll Indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-6 text-sm text-white/70"
    >
      ↓ Scroll to browse
    </motion.div>

  </div>
</section>

 {/* ================= MAIN CONTENT ================= */}
      <div className="container mx-auto px-4 py-14 flex gap-10">

        {/* ================= PRODUCTS ================= */}
        <div className="flex-1">

          {/* HEADER BAR */}
          <div className="flex justify-between items-center mb-8 bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {items.length}
              </span>{" "}
              products
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border-gray-300 border rounded-lg px-6 py-2 text-xl text-gray-600 bg-white"
            >
              <option value="newest">Newest</option>
              <option value="priceLow">
                Price: Low to High
              </option>
              <option value="priceHigh">
                Price: High to Low
              </option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* PRODUCT GRID */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-white rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        product.imageUrl ||
                        "https://placehold.co/600x400"
                      }
                      alt={product.name}
                      className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/600x400?text=Drug";
                      }}
                    />

                    {product.prescriptionRequired && (
                      <span className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow">
                        Prescription Required
                      </span>
                    )}

                    <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      In Stock
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-gray-500">
                      Sold by{" "}
                      <span className="font-medium text-gray-700">
                        {product.Pharmacy?.name ||
                          "Verified Pharmacy"}
                      </span>
                    </p>

                    <h3 className="mt-2 font-semibold text-base line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i <
                            Math.round(product.rating || 4)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.rating || 4.0})
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-lg font-bold text-teal-600">
                        {Number(product.price).toLocaleString()} FCFA
                      </p>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() =>
                          navigate(
                            `/drug/${product.id}/pharmacies`
                          )
                        }
                        className="flex-1 border-gray-300 border rounded-lg py-2 text-sm hover:bg-gray-50"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          const pharmacyId = Number(product.pharmacyId || product.Pharmacy?.id || 0);
                          if (!pharmacyId) {
                            navigate(`/drug/${product.id}/pharmacies`);
                            return;
                          }
                          addToCart(
                            {
                              id: product.id,
                              name: product.name,
                              price: Number(product.price),
                              pharmacyId,
                              pharmacyName: product.Pharmacy?.name || undefined,
                            },
                            1
                          );
                          setIsCartOpen(true);
                        }}
                        className="flex-1 bg-teal-600 text-white rounded-lg py-2 text-sm hover:bg-teal-700 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Shop;
