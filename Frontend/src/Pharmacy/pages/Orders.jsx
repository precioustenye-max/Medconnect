import { useEffect, useState } from "react";
import { deleteOrder, getMyPharmacyOrders, updateOrderStatus } from "../../services/pharmacy.api";

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

  const removeOrder = async (id) => {
    setMessage("");
    setError("");
    const shouldDelete = window.confirm("Delete this order? This cannot be undone.");
    if (!shouldDelete) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
      setMessage("Order deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h2 className="text-4xl font-bold text-slate-900">Orders</h2>
        <p className="text-slate-600 font-medium mt-2">Manage and track all customer orders</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-md">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}
      {message && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl shadow-md">
          <p className="text-emerald-700 font-semibold">{message}</p>
        </div>
      )}

      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-semibold">Loading your orders...</p>
            </div>
          </div>
        )}
        {!loading && orders.map((order) => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all">
            <div className="flex flex-wrap justify-between gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold text-slate-900">Order</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-emerald-500">CFA{Number(order.totalAmount || 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-slate-700 font-semibold">Status:</span>
                <select
                  className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition bg-white font-medium text-slate-700"
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
              <button
                onClick={() => removeOrder(order.id)}
                className="text-sm font-semibold text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition"
              >
                Delete order
              </button>
            </div>
          </div>
        ))}
        {!loading && !orders.length && (
          <div className="text-center py-12 bg-linear-to-br from-blue-50 to-slate-50 rounded-lg border border-blue-200">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-700 text-lg font-bold">No orders yet</p>
            <p className="text-slate-500 text-sm mt-1 font-medium">When you receive orders, they'll appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
