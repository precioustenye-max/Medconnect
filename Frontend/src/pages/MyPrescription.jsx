import { useEffect, useMemo, useState } from "react";
import { deleteMyPrescription, getMyPrescriptions } from "../services/prescription.api";

const statusConfig = {
  submitted: "bg-yellow-100 text-yellow-700",
  verified: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export const MyPrescription = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyPrescriptions();
      setItems(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.status === filter);
  }, [items, filter]);

  const onDelete = async (id) => {
    setError("");
    setMessage("");
    try {
      await deleteMyPrescription(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage("Prescription deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete prescription");
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">My Prescriptions</h3>
        <p className="text-gray-600 mt-1">Track verification status from pharmacies.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "submitted", label: "Submitted" },
          { key: "verified", label: "Verified" },
          { key: "rejected", label: "Rejected" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === item.key ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading && <p className="text-gray-600">Loading prescriptions...</p>}

      {!loading && filtered.length === 0 && (
        <div className="rounded-lg border bg-white p-6 text-gray-600">No prescriptions found.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.drugName}</h4>
                  <p className="text-sm text-gray-600 mt-1">Patient: {item.patientName}</p>
                  <p className="text-sm text-gray-600">Doctor: {item.doctorName}</p>
                  <p className="text-sm text-gray-600">
                    Pharmacy: {item.Pharmacy?.name || "Unknown"} {item.Pharmacy?.location ? `(${item.Pharmacy.location})` : ""}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[item.status] || "bg-gray-100 text-gray-700"}`}>
                  {item.status}
                </span>
              </div>

              {item.notes && <p className="text-sm text-gray-700 mt-3">Notes: {item.notes}</p>}
              {item.documentUrl && (
                <a href={item.documentUrl} target="_blank" rel="noreferrer" className="text-sm text-teal-700 underline mt-3 inline-block">
                  View submitted document
                </a>
              )}
              {item.status === "rejected" && item.rejectionReason && (
                <p className="text-sm text-red-700 mt-2">Reason: {item.rejectionReason}</p>
              )}

              <p className="text-xs text-gray-500 mt-3">Submitted: {new Date(item.createdAt).toLocaleString()}</p>

              {item.status === "submitted" && (
                <button onClick={() => onDelete(item.id)} className="mt-3 text-sm text-red-600 underline">
                  Delete submission
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyPrescription;
