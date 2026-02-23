import { useEffect, useState } from "react";
import { createPrescription } from "../services/prescription.api";
import { getPublicPharmacies } from "../services/public.api";

const initialForm = {
  pharmacyId: "",
  drugName: "",
  patientName: "",
  doctorName: "",
  notes: "",
};

const PrescripeSection = () => {
  const [form, setForm] = useState(initialForm);
  const [documentDataUrl, setDocumentDataUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingPharmacies(true);
        const data = await getPublicPharmacies({ page: 1, limit: 100, sort: "name" });
        setPharmacies(data.items || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load pharmacies");
      } finally {
        setLoadingPharmacies(false);
      }
    };

    load();
  }, []);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onPickDocument = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Keep uploads lightweight for current base64 storage approach.
    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose a file smaller than 5MB.");
      return;
    }

    setError("");
    setDocumentName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setDocumentDataUrl(result);
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try another image.");
      setDocumentDataUrl("");
      setDocumentName("");
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setSubmitting(true);
      const payload = {
        pharmacyId: Number(form.pharmacyId),
        drugName: form.drugName,
        patientName: form.patientName,
        doctorName: form.doctorName,
        documentUrl: documentDataUrl || undefined,
        notes: form.notes || undefined,
      };
      await createPrescription(payload);
      setMessage("Prescription submitted successfully. A pharmacy will review it.");
      setForm(initialForm);
      setDocumentDataUrl("");
      setDocumentName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit prescription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <h3 className="text-2xl font-semibold text-gray-900">Upload Prescription</h3>
      <p className="text-gray-600 mt-1">Submit prescription details for pharmacy verification.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">Target Pharmacy</label>
          <select
            value={form.pharmacyId}
            onChange={(e) => onChange("pharmacyId", e.target.value)}
            disabled={loadingPharmacies}
            className="w-full border border-gray-300 text-gray-600 font-medium rounded-lg px-3 py-2"
            required
          >
            <option value="">{loadingPharmacies ? "Loading pharmacies..." : "Select pharmacy"}</option>
            {pharmacies.map((pharmacy) => (
              <option key={pharmacy.id} value={pharmacy.id}>
                {pharmacy.name} - {pharmacy.location}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Medication Name</label>
            <input
              value={form.drugName}
              onChange={(e) => onChange("drugName", e.target.value)}
              className="w-full border-1 border-gray-300  border-gray-300 rounded-lg px-3 py-2"
              placeholder="e.g. Amoxicillin 500mg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input
              value={form.patientName}
              onChange={(e) => onChange("patientName", e.target.value)}
              className="w-full border-1 border-gray-300  border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Prescribing Doctor</label>
            <input
              value={form.doctorName}
              onChange={(e) => onChange("doctorName", e.target.value)}
              className="w-full border-1 border-gray-300  border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Upload Prescription Image</label>
            <label className="w-full border-2 border-dashed border-gray-300 rounded-lg px-3 py-3 flex items-center justify-center text-sm text-gray-700 cursor-pointer hover:border-teal-400">
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={onPickDocument} />
              {documentName ? `Selected: ${documentName}` : "Choose file from phone/computer"}
            </label>
          </div>
        </div>

        {documentDataUrl && (
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Preview</p>
            {documentDataUrl.startsWith("data:application/pdf") ? (
              <a href={documentDataUrl} target="_blank" rel="noreferrer" className="text-sm text-teal-700 underline">
                Open uploaded PDF
              </a>
            ) : (
              <img src={documentDataUrl} alt="Prescription preview" className="max-h-52 rounded border" />
            )}
          </div>
        )}

        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={4}
            placeholder="Add any context for the pharmacy"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-teal-600 text-white px-5 py-2.5 text-lge rounded-lg disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Prescription"}
        </button>
      </form>
    </section>
  );
};

export default PrescripeSection;
