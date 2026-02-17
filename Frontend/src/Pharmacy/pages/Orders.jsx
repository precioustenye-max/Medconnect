import { useEffect, useState } from "react";
import { getMyPharmacyOrders, updateOrderStatus } from "../../services/pharmacy.api";

export default function PharmacyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMyPharmacyOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setMessage("");
    setError("");
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setMessage("Order status updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Orders</h2>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-700">{message}</p>}

      <div className="space-y-3">
        {loading && <p>Loading orders...</p>}
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <p>Order #{order.id}</p>
              <p>Total: {order.totalAmount}</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span>Status:</span>
              <select
                className="border rounded px-2 py-1"
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="processing">processing</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
          </div>
        ))}
        {!orders.length && <p className="text-gray-500">No orders yet.</p>}
      </div>
    </div>
  );
}
