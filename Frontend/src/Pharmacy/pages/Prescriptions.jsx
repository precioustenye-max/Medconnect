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
      <div>
        <h2 className="text-2xl font-semibold">Prescription Verification</h2>
        <p className="text-gray-600 mt-1">Review patient submissions and approve or reject them.</p>
      </div>

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

      {loading && <p>Loading prescriptions...</p>}

      {!loading && filtered.length === 0 && (
        <div className="rounded-lg border bg-white p-5 text-gray-600">No prescriptions in this view.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-xl border-1 border-gray-400 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.drugName}</h3>
                  <p className="text-sm text-gray-600 mt-1">Patient: {item.patientName}</p>
                  <p className="text-sm text-gray-600">Doctor: {item.doctorName}</p>
                  <p className="text-sm text-gray-600">User: {item.User?.name || "Unknown"} ({item.User?.email || "No email"})</p>
                  {item.notes && <p className="text-sm text-gray-700 mt-2">Notes: {item.notes}</p>}
                  {item.documentUrl && (
                    <a href={item.documentUrl} target="_blank" rel="noreferrer" className="text-sm text-teal-700 underline mt-2 inline-block">
                      Open document
                    </a>
                  )}
                  {item.status === "rejected" && item.rejectionReason && (
                    <p className="text-sm text-red-700 mt-2">Rejection reason: {item.rejectionReason}</p>
                  )}
                </div>
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-3">Submitted: {new Date(item.createdAt).toLocaleString()}</p>

              {item.status === "submitted" && (
                <div className="mt-4 space-y-2">
                  <input
                    value={reasons[item.id] || ""}
                    onChange={(e) => setReasons((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Reason (required only if rejecting)"
                    className="w-full border-gray-500 border-1 rounded-2xl px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => onReview(item.id, "verified")} className="px-3 py-1 text-sm bg-green-600 text-white rounded-2xl">
                      Approve
                    </button>
                    <button onClick={() => onReview(item.id, "rejected")} className="px-3 py-1 text-sm bg-red-600 text-white rounded-2xl">
                      Reject
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
