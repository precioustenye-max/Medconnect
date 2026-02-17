import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAdminUsers } from "../../services/admin.api";

export default function Users() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);

  const query = useMemo(
    () => ({
      page: Number(params.get("page") || 1),
      q: params.get("q") || "",
      role: params.get("role") || "",
    }),
    [params]
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminUsers({ page: query.page, q: query.q || undefined, role: query.role || undefined });
      setItems(data.items || []);
      setMeta(data.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query.page, query.q, query.role]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, String(value));
    });
    if (updates.page === undefined) next.set("page", "1");
    setParams(next);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>

      <div className="flex flex-wrap gap-2">
        <input
          value={query.q}
          onChange={(e) => updateParams({ q: e.target.value, page: 1 })}
          placeholder="Search users"
          className="border rounded px-3 py-2"
        />
        <select value={query.role} onChange={(e) => updateParams({ role: e.target.value, page: 1 })} className="border rounded px-3 py-2">
          <option value="">All roles</option>
          <option value="patient">Patient</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading && <p>Loading users...</p>}
      {!loading && error && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-3">
          <p>{error}</p>
          <button className="underline mt-2" onClick={load}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && <p className="text-gray-500">No users found.</p>}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="space-y-3">
            {items.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-teal-600 capitalize">{user.role}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
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
        </>
      )}
    </div>
  );
}
