import { useEffect, useMemo, useState } from "react";
import { getMyPharmacyPrescriptions, reviewPrescription } from "../../services/prescription.api";

export default function PharmacyPrescriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("submitted");
  const [reasons, setReasons] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyPharmacyPrescriptions();
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

  const onReview = async (id, status) => {
    setError("");
    setMessage("");
    try {
      const payload = { status };
      if (status === "rejected") {
        const rejectionReason = (reasons[id] || "").trim();
        if (!rejectionReason) {
          setError("Please provide a rejection reason.");
          return;
        }
        payload.rejectionReason = rejectionReason;
      }

      const res = await reviewPrescription(id, payload);
      setItems((prev) => prev.map((item) => (item.id === id ? res.prescription : item)));
      setMessage(`Prescription #${id} updated to ${status}.`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to review prescription");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-50 p-6 rounded-xl border border-cyan-200">
        <h2 className="text-3xl font-bold text-slate-900">Prescription Verification</h2>
        <p className="text-slate-600 font-medium mt-2">Review patient submissions and approve or reject them.</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "submitted", label: "Submitted" },
          { key: "verified", label: "Verified" },
          { key: "rejected", label: "Rejected" },
          { key: "all", label: "All" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === item.key ? "bg-cyan-500 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Alert Messages */}
      {message && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl shadow-md">
          <p className="text-emerald-700 font-semibold">{message}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-md">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-300 border-t-cyan-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold">Loading prescriptions...</p>
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
          <p className="text-slate-600 font-medium">No prescriptions in this view.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-cyan-300 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{item.drugName}</h3>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-slate-600"><span className="font-semibold">Patient:</span> {item.patientName}</p>
                    <p className="text-slate-600"><span className="font-semibold">Doctor:</span> {item.doctorName}</p>
                    <p className="text-slate-600"><span className="font-semibold">User:</span> {item.User?.name || "Unknown"} ({item.User?.email || "No email"})</p>
                  </div>
                  {item.notes && <p className="text-sm text-slate-700 mt-3 bg-slate-50 p-2 rounded border border-slate-200">📝 <span className="font-semibold">Notes:</span> {item.notes}</p>}
                  {item.documentUrl && (
                    <a href={item.documentUrl} target="_blank" rel="noreferrer" className="text-sm text-cyan-600 font-bold underline mt-3 inline-block hover:text-cyan-700">
                      Open document
                    </a>
                  )}
                  {item.status === "rejected" && item.rejectionReason && (
                    <p className="text-sm text-red-700 mt-3 bg-red-50 p-2 rounded border border-red-200">❌ <span className="font-semibold">Rejection reason:</span> {item.rejectionReason}</p>
                  )}
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
                  item.status === "verified" ? "bg-emerald-500 text-white" :
                  item.status === "rejected" ? "bg-red-500 text-white" :
                  "bg-yellow-400 text-white"
                }`}>
                  {item.status === "verified" ? "✅ Verified" : item.status === "rejected" ? "❌ Rejected" : "⏳ Submitted"}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-3">📅 Submitted: {new Date(item.createdAt).toLocaleString()}</p>

              {item.status === "submitted" && (
                <div className="mt-4 space-y-3 pt-4 border-t border-slate-200">
                  <textarea
                    value={reasons[item.id] || ""}
                    onChange={(e) => setReasons((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Reason (required only if rejecting)"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    rows="2"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => onReview(item.id, "verified")} className="flex-1 px-4 py-2 text-sm font-bold bg-emerald-500 text-white rounded-lg hover:shadow-lg transition-all">
                      ✅ Approve
                    </button>
                    <button onClick={() => onReview(item.id, "rejected")} className="flex-1 px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:shadow-lg transition-all">
                      ❌ Reject
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
