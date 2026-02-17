import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Shield, Star, Truck } from "lucide-react";
import ProductCard from "../Components/UI/ProductCard";
import { useCart } from "../contexts/CartContext";
import { getPublicPharmacyById, getPublicPharmacyDrugs } from "../services/public.api";

const PharmacyDrugs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [params, setParams] = useSearchParams();

  const [pharmacy, setPharmacy] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => ({
      page: Number(params.get("page") || 1),
      q: params.get("q") || "",
    }),
    [params]
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [pharmacyRes, drugsRes] = await Promise.all([
        getPublicPharmacyById(id),
        getPublicPharmacyDrugs(id, {
          page: query.page,
          limit: 12,
          q: query.q || undefined,
        }),
      ]);
      setPharmacy(pharmacyRes);
      setDrugs(drugsRes.items || []);
      setMeta(drugsRes.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pharmacy drugs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id, query.page, query.q]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") next.delete(key);
      else next.set(key, String(value));
    });
    setParams(next);
  };

  const handleAddToCart = (drug) => {
    addToCart(
      {
        id: drug.id,
        name: drug.name,
        price: Number(drug.price),
        src: drug.imageUrl || "https://placehold.co/600x400?text=Drug",
        category: drug.category || "General",
        prescriptionRequired: Boolean(drug.prescriptionRequired),
        pharmacyId: pharmacy?.id,
        pharmacyName: pharmacy?.name,
      },
      1
    );
    setIsCartOpen(true);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 md:pt-24">Loading pharmacy details...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:pt-24">
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4">
          <p>{error}</p>
          <button className="underline mt-2" onClick={load}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!pharmacy) {
    return <div className="container mx-auto px-4 py-8 md:pt-24">Pharmacy not found.</div>;
  }

  return (
    <div className="container mx-auto px-2 md:px-6 py-8 md:pt-24">
      <button onClick={() => navigate("/pharmacies")} className="flex items-center text-teal-600 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Pharmacies
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h1 className="md:text-3xl text-2xl font-bold">{pharmacy.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="w-4 h-4 mr-1" /> {pharmacy.location || "Unknown location"}
            </div>
            <div className="flex items-center mt-2">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              {Number(pharmacy.rating || 0).toFixed(1)}
            </div>
          </div>
          <div className="text-right">
            <div className="bg-blue-50 border rounded-lg p-3 mb-3">
              <div className="flex items-center justify-end mb-1">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                Licensed & Verified
              </div>
              <p className="text-xs text-blue-700">License: {pharmacy.licenseNumber || "N/A"}</p>
            </div>
            <div className="flex items-center justify-end text-gray-600 mb-1">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{pharmacy.operatingHours || "N/A"}</span>
            </div>
            <div className="flex items-center justify-end text-gray-600">
              <Truck className="w-4 h-4 mr-2" />
              <span className="text-sm">{pharmacy.serviceType || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={query.q}
          onChange={(e) => updateParams({ q: e.target.value, page: 1 })}
          placeholder="Search drugs"
          className="w-full md:w-96 border rounded px-3 py-2"
        />
      </div>

      {drugs.length === 0 ? (
        <div className="bg-white rounded border p-6">No drugs found for this pharmacy.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drugs.map((drug) => (
            <ProductCard
              key={drug.id}
              product={{
                ...drug,
                src: drug.imageUrl || "https://placehold.co/600x400?text=Drug",
                category: drug.category || "General",
                prescriptionRequired: Boolean(drug.prescriptionRequired),
              }}
              onClick={() => {}}
              onAddToCart={() => handleAddToCart(drug)}
            />
          ))}
        </div>
      )}

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
    </div>
  );
};

export default PharmacyDrugs;
