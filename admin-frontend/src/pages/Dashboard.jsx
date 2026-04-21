import { useState, useEffect } from "react";
import api from '../api/axios';
import { IndianRupee, ShoppingBag, AlertTriangle, TrendingUp, Package, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from "framer-motion";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get("/admin/metrics");
        setMetrics(data);
      } catch (err) {
        console.error("Failed to load metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
        <div className="h-96 bg-gray-100 rounded-xl animate-pulse mt-6"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">Live Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative"
        >
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Revenue</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">₹{metrics?.totalRevenue?.toLocaleString() || 0}</h2>
            <p className="text-sm text-green-600 mt-3 flex items-center gap-1 font-medium"><TrendingUp className="h-4 w-4"/> Growing consistently</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl relative z-10 shadow-inner">
            <IndianRupee className="h-10 w-10 text-indigo-600" />
          </div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-indigo-50 rounded-full blur-3xl"></div>
        </motion.div>

        {/* Orders Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative"
        >
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Orders</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{metrics?.totalOrders || 0}</h2>
            <p className="text-sm text-gray-500 mt-3 font-medium">Lifetime processed requests</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl relative z-10 shadow-inner">
            <ShoppingBag className="h-10 w-10 text-blue-600" />
          </div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-blue-50 rounded-full blur-3xl"></div>
        </motion.div>
      </div>

      {/* Analytics Charts */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* 7-Day Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            7-Day Revenue Trend
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={metrics?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Order Volume */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-500" />
            Order Volume
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={metrics?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [value, 'Orders']}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Details Row */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 border-t-4 border-t-amber-400 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Low Stock Alerts
          </h3>
          
          {metrics?.lowStockProducts?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-gray-900 font-medium">Inventory Healthy</p>
              <p className="text-sm text-gray-500 mt-1">No items are critically low.</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto pr-2 max-h-72">
              {metrics?.lowStockProducts?.map((item) => (
                <div key={item._id} className="p-4 rounded-xl border border-red-100 bg-red-50 flex justify-between items-center transition-transform hover:scale-[1.02]">
                  <span className="font-medium text-gray-900 line-clamp-1 mr-2">{item.name}</span>
                  <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold shrink-0">
                    {item.countInStock} LEFT
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Recent Orders
            </h3>
          </div>
          
          {metrics?.recentOrders?.length === 0 ? (
             <p className="text-sm text-gray-500 bg-gray-50 p-6 rounded-xl border border-dashed text-center mt-4">No recent orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="pb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="pb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {metrics?.recentOrders?.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block
                          ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                            'bg-gray-100 text-gray-700'}`}
                        >
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-gray-900">
                        ₹{order.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
