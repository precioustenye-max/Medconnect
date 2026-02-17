import { useEffect, useState } from "react";
import { getMyDrugs, getMyPharmacyOrders, getMyPharmacyProfile } from "../../services/pharmacy.api";

export default function PharmacyOverview() {
  const [orders, setOrders] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [profileRes, ordersRes, drugsRes] = await Promise.all([
          getMyPharmacyProfile(),
          getMyPharmacyOrders(),
          getMyDrugs(),
        ]);
        setProfile(profileRes);
        setOrders(ordersRes || []);
        setDrugs(drugsRes || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Overview</h2>
      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading dashboard...</p>}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Pharmacy</p>
          <p className="text-lg font-semibold">{profile?.name || "—"}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Drugs</p>
          <p className="text-lg font-semibold">{drugs.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-lg font-semibold">{orders.length}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between text-sm">
                <span>Order #{o.id}</span>
                <span className="text-gray-600">{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
