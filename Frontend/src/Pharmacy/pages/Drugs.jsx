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
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [imageFileName, setImageFileName] = useState("");

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

  const handleDrugImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setNewDrug((prev) => ({ ...prev, imageUrl: result }));
      setImageFileName(file.name);
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read image. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

  const onAddDrug = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await addDrug({
        ...newDrug,
        price: Number(newDrug.price),
        stock: Number(newDrug.stock || 0),
        imageUrl: newDrug.imageUrl || undefined,
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
      setImageFileName("");
      await load();
      setMessage("Drug added successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      if (err.response?.status === 413) {
        setError("Image is too large. Please use a smaller image.");
      } else {
        setError(err.response?.data?.message || "Failed to add drug");
      }
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
        imageUrl: drug.imageUrl || null,
        stock: Number(drug.stock || 0),
        prescriptionRequired: Boolean(drug.prescriptionRequired),
        isActive: Boolean(drug.isActive),
      });
      setEditingId(null);
      setMessage("Drug updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update drug");
    }
  };

  const onDeleteDrug = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drug?")) return;
    
    setMessage("");
    setError("");
    try {
      await deleteDrug(id);
      setDrugs((prev) => prev.filter((d) => d.id !== id));
      setMessage("Drug deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete drug");
    }
  };

  // Filter drugs based on search and category
  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || drug.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ["all", ...new Set(drugs.map(d => d.category).filter(Boolean))];

  if (loading && drugs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your drug inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Drug Inventory</h2>
          <p className="text-gray-500 mt-1">Manage your pharmacy's medication stock</p>
        </div>
        <div className="bg-teal-50 px-4 py-2 rounded-lg">
          <span className="text-sm text-teal-600 font-medium">Total Drugs: {drugs.length}</span>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-700">{message}</p>
          </div>
        </div>
      )}

      {/* Add Drug Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Drug
        </h3>
        
        <form onSubmit={onAddDrug} className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name *</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                value={newDrug.name} 
                onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })} 
                placeholder="e.g., Paracetamol" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                value={newDrug.category} 
                onChange={(e) => setNewDrug({ ...newDrug, category: e.target.value })} 
                placeholder="e.g., Pain Relief" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input 
                  className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={newDrug.price} 
                  onChange={(e) => setNewDrug({ ...newDrug, price: e.target.value })} 
                  placeholder="0.00" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                type="number" 
                min="0"
                value={newDrug.stock} 
                onChange={(e) => setNewDrug({ ...newDrug, stock: e.target.value })} 
                placeholder="0" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Drug Image</label>
              <label className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center text-sm text-gray-700 cursor-pointer hover:border-teal-400 transition">
                <input type="file" accept="image/*" className="hidden" onChange={handleDrugImageUpload} />
                {imageFileName ? `Selected: ${imageFileName}` : "Upload drug image"}
              </label>
              {newDrug.imageUrl && (
                <img
                  src={newDrug.imageUrl}
                  alt="Drug preview"
                  className="mt-3 h-28 w-28 object-cover rounded border"
                />
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                rows="2"
                value={newDrug.description} 
                onChange={(e) => setNewDrug({ ...newDrug, description: e.target.value })} 
                placeholder="Brief description of the drug..."
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  checked={newDrug.prescriptionRequired} 
                  onChange={(e) => setNewDrug({ ...newDrug, prescriptionRequired: e.target.checked })} 
                />
                <span className="text-sm text-gray-700">Prescription required</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              type="submit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Drug to Inventory
            </button>
          </div>
        </form>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search drugs by name, category, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Drugs List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
          <span>Drug List</span>
          <span className="text-sm font-normal text-gray-500">
            Showing {filteredDrugs.length} of {drugs.length} drugs
          </span>
        </h3>

        {filteredDrugs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 4v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8L8 4z" />
            </svg>
            <p className="text-gray-500 text-lg">No drugs found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || categoryFilter !== "all" ? "Try adjusting your search or filter" : "Add your first drug using the form above"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDrugs.map((drug) => (
              <div 
                key={drug.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingId === drug.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <input 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                        value={drug.name || ""} 
                        onChange={(e) => setDrugs((prev) => prev.map((d) => (d.id === drug.id ? { ...d, name: e.target.value } : d)))}
                        placeholder="Name"
                      />
                      <input 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                        value={drug.category || ""} 
                        onChange={(e) => setDrugs((prev) => prev.map((d) => (d.id === drug.id ? { ...d, category: e.target.value } : d)))}
                        placeholder="Category"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                        <input 
                          className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                          type="number" 
                          value={drug.price} 
                          onChange={(e) => setDrugs((prev) => prev.map((d) => (d.id === drug.id ? { ...d, price: e.target.value } : d)))}
                          placeholder="Price"
                        />
                      </div>
                      <input 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                        type="number" 
                        value={drug.stock || 0} 
                        onChange={(e) => setDrugs((prev) => prev.map((d) => (d.id === drug.id ? { ...d, stock: e.target.value } : d)))}
                        placeholder="Stock"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        onClick={() => onUpdateDrug(drug)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Save
                      </button>
                      <button 
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{drug.name}</h4>
                        {drug.prescriptionRequired && (
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                            Prescription Required
                          </span>
                        )}
                        {drug.stock <= 10 && drug.stock > 0 && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                            Low Stock
                          </span>
                        )}
                        {drug.stock === 0 && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium text-gray-700">{drug.category || "—"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-medium text-gray-700">${Number(drug.price).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <p className="font-medium text-gray-700">{drug.stock || 0} units</p>
                        </div>
                      </div>
                      
                      {drug.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{drug.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setEditingId(drug.id)}
                        title="Edit drug"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => onDeleteDrug(drug.id)}
                        title="Delete drug"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
