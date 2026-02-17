import { useEffect, useState } from "react";
import { addDrug, deleteDrug, getMyDrugs, updateDrug } from "../../services/pharmacy.api";

export default function PharmacyDrugsPage() {
  const [drugs, setDrugs] = useState([]);
  const [newDrug, setNewDrug] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    prescriptionRequired: false,
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMyDrugs();
      setDrugs(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load drugs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAddDrug = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await addDrug({
        ...newDrug,
        price: Number(newDrug.price),
        stock: Number(newDrug.stock || 0),
      });
      setNewDrug({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        prescriptionRequired: false,
      });
      await load();
      setMessage("Drug added");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add drug");
    }
  };

  const onUpdateDrug = async (drug) => {
    setMessage("");
    setError("");
    try {
      await updateDrug(drug.id, {
        name: drug.name,
        category: drug.category,
        description: drug.description,
        price: Number(drug.price),
        stock: Number(drug.stock || 0),
        imageUrl: drug.imageUrl,
        prescriptionRequired: Boolean(drug.prescriptionRequired),
        isActive: Boolean(drug.isActive),
      });
      setMessage("Drug updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update drug");
    }
  };

  const onDeleteDrug = async (id) => {
    setMessage("");
    setError("");
    try {
      await deleteDrug(id);
      setDrugs((prev) => prev.filter((d) => d.id !== id));
      setMessage("Drug deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete drug");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Drugs</h2>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-700">{message}</p>}

      <form onSubmit={onAddDrug} className="grid md:grid-cols-4 gap-2">
        <input className="border rounded px-3 py-2" value={newDrug.name} onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })} placeholder="Drug name" required />
        <input className="border rounded px-3 py-2" value={newDrug.category} onChange={(e) => setNewDrug({ ...newDrug, category: e.target.value })} placeholder="Category" />
        <input className="border rounded px-3 py-2" type="number" min="1" value={newDrug.price} onChange={(e) => setNewDrug({ ...newDrug, price: e.target.value })} placeholder="Price" required />
        <input className="border rounded px-3 py-2" type="number" min="0" value={newDrug.stock} onChange={(e) => setNewDrug({ ...newDrug, stock: e.target.value })} placeholder="Stock" />
        <input className="border rounded px-3 py-2 md:col-span-2" value={newDrug.imageUrl} onChange={(e) => setNewDrug({ ...newDrug, imageUrl: e.target.value })} placeholder="Image URL" />
        <input className="border rounded px-3 py-2 md:col-span-2" value={newDrug.description} onChange={(e) => setNewDrug({ ...newDrug, description: e.target.value })} placeholder="Description" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={newDrug.prescriptionRequired} onChange={(e) => setNewDrug({ ...newDrug, prescriptionRequired: e.target.checked })} />
          Prescription required
        </label>
        <button className="bg-teal-600 text-white px-4 py-2 rounded w-fit" type="submit">
          Add Drug
        </button>
      </form>

      {loading ? <p>Loading drugs...</p> : null}
      <div className="space-y-2">
        {drugs.map((drug) => (
          <div key={drug.id} className="grid md:grid-cols-6 gap-2 border rounded p-2 items-center">
            <input className="border rounded px-2 py-1" value={drug.name || ""} onChange={(e) => setDrugs((prev) => prev.map((d) => (d.id === drug.id ? { ...d, name: e.target.value } : d)))} />
            <input className="border rounded px-2 py-1" value={drug.category || ""} onChange={(e) => setDrugs((prev) => prev.map((d) => (d.id === drug.id ? { ...d, category: e.target.value } : d)))} />
            <input className="border rounded px-2 py-1" type="number" value={drug.price} onChange={(e) => setDrugs((prev) => prev.map((d) => (d.id === drug.id ? { ...d, price: e.target.value } : d)))} />
            <input className="border rounded px-2 py-1" type="number" value={drug.stock || 0} onChange={(e) => setDrugs((prev) => prev.map((d) => (d.id === drug.id ? { ...d, stock: e.target.value } : d)))} />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => onUpdateDrug(drug)}>
              Update
            </button>
            <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => onDeleteDrug(drug.id)}>
              Delete
            </button>
          </div>
        ))}
        {!loading && !drugs.length && <p className="text-gray-500">No drugs yet.</p>}
      </div>
    </div>
  );
}
