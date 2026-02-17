import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Shield, Star, Truck } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { getPublicDrugPharmacies } from "../services/public.api";

const DrugPharmacies = () => {
  const { drugId } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drug, setDrug] = useState(null);
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPublicDrugPharmacies(drugId);
      setDrug(data.drug || null);
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load drug availability");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [drugId]);

  const handleAddToCart = (item) => {
    const mapped = {
      id: item.drug.id,
      name: item.drug.name,
      price: Number(item.drug.price),
      src: item.drug.imageUrl || "https://placehold.co/600x400?text=Drug",
      category: item.drug.category || "General",
      prescriptionRequired: Boolean(item.drug.prescriptionRequired),
      pharmacyId: item.pharmacy.id,
      pharmacyName: item.pharmacy.name,
    };
    addToCart(mapped, 1);
    setIsCartOpen(true);
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-8 md:pt-24">Loading drug availability...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 md:pt-24">
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4">
          <p>{error}</p>
          <button className="underline mt-2" onClick={load}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!drug) {
    return <div className="container mx-auto px-6 py-8 md:pt-24">Drug not found.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 md:pt-24">
      <button onClick={() => navigate("/shop")} className="flex items-center text-teal-600 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Shop
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-4">
          <img
            src={drug.imageUrl || "https://placehold.co/160x160?text=Drug"}
            alt={drug.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{drug.name}</h1>
            <p className="text-gray-600">{drug.category || "General"}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Available at {items.length} Pharmac{items.length === 1 ? "y" : "ies"}
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded border">
          <p className="text-gray-600 mb-4">This medication is not available right now.</p>
          <button onClick={() => navigate("/shop")} className="bg-teal-600 text-white px-6 py-2 rounded-lg">
            Browse Other Medications
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const pharmacy = item.pharmacy;
            return (
              <div key={`${item.drug.id}-${pharmacy.id}`} className="bg-white rounded-lg shadow-md p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{pharmacy.name}</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{pharmacy.location || "Unknown location"}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${pharmacy.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {pharmacy.isOpen ? "Open" : "Closed"}
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4 text-center">
                  <p className="text-sm text-teal-700 mb-1">Price at this pharmacy</p>
                  <p className="text-2xl font-bold text-teal-600">{Number(item.drug.price).toLocaleString()} FCFA</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="w-4 h-4 mr-2" />
                    {pharmacy.operatingHours || "N/A"}
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Truck className="w-4 h-4 mr-2" />
                    {pharmacy.serviceType || "N/A"}
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {Number(pharmacy.rating || 0).toFixed(1)}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Licensed & Verified</span>
                  </div>
                  <p className="text-xs text-blue-700 text-center mt-1">{pharmacy.licenseNumber || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/pharmacy/${pharmacy.id}/drugs`)}
                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg"
                  >
                    View Pharmacy
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!pharmacy.isOpen}
                    className={`w-full py-2 px-4 rounded-lg ${pharmacy.isOpen ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"}`}
                  >
                    {pharmacy.isOpen ? "Add to Cart" : "Currently Closed"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DrugPharmacies;
