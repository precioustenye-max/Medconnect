import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart, Store, Users } from "lucide-react";
import { getAdminStats } from "../../services/admin.api";

const metricConfig = [
  { key: "users", label: "Total Users", icon: Users },
  { key: "pharmacies", label: "Total Pharmacies", icon: Store },
  { key: "drugs", label: "Total Drugs", icon: Package },
  { key: "orders", label: "Total Orders", icon: ShoppingCart },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {loading && <p>Loading dashboard...</p>}
      {!loading && error && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4">
          <p>{error}</p>
          <button className="underline mt-2" onClick={load}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricConfig.map((metric) => (
              <div key={metric.key} className="bg-white rounded-xl border p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-teal-600">
                  <metric.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-semibold">{stats?.totals?.[metric.key] ?? 0}</p>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-teal-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold">{Number(stats?.totals?.revenue || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            {!stats?.recentOrders?.length ? (
              <p className="text-gray-500">No recent orders.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-wrap justify-between gap-2 border rounded-lg p-3">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.User?.name || "Unknown user"} - {order.Pharmacy?.name || "Unknown pharmacy"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{Number(order.totalAmount || 0).toLocaleString()} FCFA</p>
                      <p className="text-sm text-gray-500">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
