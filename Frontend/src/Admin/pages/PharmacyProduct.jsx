import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  Clock3,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { getAdminPharmacies } from "../../services/admin.api";

export default function PharmacyProducts() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);

  const query = useMemo(
    () => ({
      page: Number(params.get("page") || 1),
      q: params.get("q") || "",
      status: params.get("status") || "all",
      delivery: params.get("delivery") || "all",
    }),
    [params]
  );

  const updateParams = (updates) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") next.delete(key);
      else next.set(key, String(value));
    });
    if (updates.page === undefined) next.set("page", "1");
    setParams(next);
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminPharmacies({ page: query.page, q: query.q || undefined });
      setItems(data.items || []);
      setMeta(data.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pharmacies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query.page, query.q]);

  const filteredItems = useMemo(() => {
    return items.filter((pharmacy) => {
      const statusMatch =
        query.status === "all" ||
        (query.status === "open" && pharmacy.isOpen) ||
        (query.status === "closed" && !pharmacy.isOpen);

      const deliveryMatch =
        query.delivery === "all" ||
        (query.delivery === "yes" && pharmacy.delivery) ||
        (query.delivery === "no" && !pharmacy.delivery);

      return statusMatch && deliveryMatch;
    });
  }, [items, query.status, query.delivery]);

  const metrics = useMemo(() => {
    const verified = items.filter((pharmacy) => pharmacy.verified).length;
    const open = items.filter((pharmacy) => pharmacy.isOpen).length;
    const delivery = items.filter((pharmacy) => pharmacy.delivery).length;

    return {
      total: meta?.totalItems ?? items.length,
      verified,
      open,
      delivery,
    };
  }, [items, meta?.totalItems]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50 to-teal-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700">Admin Control Center</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Pharmacy Management</h2>
            <p className="mt-2 text-sm text-slate-600">Monitor verified pharmacies, delivery capability, and operational status.</p>
          </div>
          <div className="rounded-2xl bg-white/70 px-4 py-3 border border-emerald-100">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Listed</p>
            <p className="text-3xl font-bold text-slate-900">{metrics.total}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">On This Page</p>
              <p className="text-xl font-semibold text-slate-900">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Verified</p>
              <p className="text-xl font-semibold text-slate-900">{metrics.verified}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Currently Open</p>
              <p className="text-xl font-semibold text-slate-900">{metrics.open}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Delivery Enabled</p>
              <p className="text-xl font-semibold text-slate-900">{metrics.delivery}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query.q}
              onChange={(e) => updateParams({ q: e.target.value, page: 1 })}
              placeholder="Search by pharmacy name or location"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <select
            value={query.status}
            onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open Now</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={query.delivery}
            onChange={(e) => updateParams({ delivery: e.target.value, page: 1 })}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="all">All Delivery Types</option>
            <option value="yes">Delivery Available</option>
            <option value="no">No Delivery</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-slate-600">Loading pharmacies...</p>}

      {!loading && error && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-4">
          <p>{error}</p>
          <button className="underline mt-2" onClick={load}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filteredItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-3 font-medium text-slate-700">No pharmacies match these filters.</p>
          <p className="text-sm text-slate-500">Try adjusting search or status filters.</p>
        </div>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredItems.map((pharmacy) => (
            <div key={pharmacy.id} className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{pharmacy.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {pharmacy.location || "Location not provided"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      pharmacy.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {pharmacy.isOpen ? "Open" : "Closed"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      pharmacy.verified ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {pharmacy.verified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Operating Hours</p>
                  <p className="mt-1 font-medium text-slate-800">{pharmacy.operatingHours || "Not specified"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Service Type</p>
                  <p className="mt-1 font-medium text-slate-800">{pharmacy.serviceType || "General Pharmacy"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Contact</p>
                  <p className="mt-1 flex items-center gap-1.5 font-medium text-slate-800">
                    <Phone className="h-4 w-4 text-slate-500" />
                    {pharmacy.phone || "Not provided"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">License</p>
                  <p className="mt-1 font-medium text-slate-800">{pharmacy.licenseNumber || "Unavailable"}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {pharmacy.delivery && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    <Truck className="h-3.5 w-3.5" />
                    Delivery
                  </span>
                )}
                {pharmacy.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Trusted Partner
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
          <button
            disabled={!meta?.hasPrev}
            onClick={() => updateParams({ page: Math.max(1, query.page - 1) })}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-slate-600">
            Page {meta?.page || 1} of {meta?.totalPages || 1}
          </p>
          <button
            disabled={!meta?.hasNext}
            onClick={() => updateParams({ page: query.page + 1 })}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
