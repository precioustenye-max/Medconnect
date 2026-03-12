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
  
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-400 text-white shadow-md",
      completed: "bg-emerald-500 text-white shadow-md",
      cancelled: "bg-red-500 text-white shadow-md",
      processing: "bg-cyan-500 text-white shadow-md",
    };
    return colors[status?.toLowerCase()] || "bg-slate-400 text-white shadow-md";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-300 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="mt-1 text-slate-600">Monitor your pharmacy performance and activities</p>
      </div>

      {error && (
        <div className="border-l-4 border-red-500 rounded-lg bg-red-50 p-4">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="rounded-2xl border border-cyan-200 bg-slate-900 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name || 'Pharmacy'}! 👋</h1>
            <p className="text-slate-300">Monitor your inventory and process orders efficiently</p>
          </div>
          <div className="hidden md:block text-6xl"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Pharmacy Card */}
        <div className="rounded-2xl border border-slate-200 bg-blue-50 p-6 hover:shadow-lg transition">
          <div className="p-3 bg-blue-500 rounded-xl w-fit mb-4 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm text-slate-600 font-semibold">Pharmacy</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{profile?.name || "—"}</p>
          {profile?.location && (
            <p className="text-sm text-slate-600 mt-3 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {profile?.location}
            </p>
          )}
        </div>

        {/* Drugs Card */}
        <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-6 hover:shadow-lg transition">
          <div className="p-3 bg-emerald-500 rounded-xl w-fit mb-4 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 4v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8L8 4z" />
            </svg>
          </div>
          <p className="text-sm text-slate-600 font-semibold">Total Drugs</p>
          <p className="text-3xl font-bold text-emerald-900 mt-1">{drugs.length}</p>
          <p className="text-xs text-slate-600 mt-3 font-medium">
            {drugs.length > 0 ? `${drugs.filter(d => d.stock > 0).length} in stock` : 'No drugs listed'}
          </p>
        </div>

        {/* Orders Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6 hover:shadow-lg transition">
          <div className="p-3 bg-blue-600 rounded-xl w-fit mb-4 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-sm text-slate-600 font-semibold">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{orders.length}</p>
          <p className="text-xs text-slate-600 mt-3 font-medium">
            {orders.filter(o => o.status === 'pending').length} pending, {' '}
            {orders.filter(o => o.status === 'completed').length} completed
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
        <div className="p-6 border-b border-slate-200/50 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Recent Orders</h3>
              <p className="text-sm text-slate-600 mt-1">Latest 5 orders from your pharmacy</p>
            </div>
            {orders.length > 5 && (
              <button className="text-sm bg-cyan-500 hover:shadow-lg text-white font-bold px-3 py-1 rounded-full transition-all">
                View all orders →
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-100/50">
              <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-700 text-lg font-semibold">No orders yet</p>
              <p className="text-slate-500 text-sm mt-1">When you receive orders, they'll appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:bg-linear-to-r hover:from-slate-50 hover:to-blue-50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${index % 3 === 0 ? 'bg-cyan-500' : index % 3 === 1 ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Order</p>
                      {order.customer && (
                        <p className="text-xs text-slate-500 font-medium">{order.customer}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                    {order.total && (
                      <span className="text-sm font-bold text-emerald-500">
                        ${order.total.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button className="p-4 rounded-xl border border-cyan-200 bg-cyan-50 hover:shadow-lg hover:border-cyan-300 transition-all text-left group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-cyan-500 rounded-lg group-hover:shadow-lg group-hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900">➕ Add New Drug</p>
              <p className="text-sm text-slate-600 font-medium">Add medication to inventory</p>
            </div>
          </div>
        </button>
        
        <button className="p-4 rounded-xl border border-slate-200 bg-slate-100 hover:shadow-lg hover:border-slate-300 transition-all text-left group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-lg group-hover:shadow-lg group-hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900">View All Orders</p>
              <p className="text-sm text-slate-600 font-medium">Manage and track orders</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}