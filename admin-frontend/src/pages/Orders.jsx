import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        // Handle both formats: direct array or nested in data/orders property
        const ordersData = response.data.orders || response.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistic UI update
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        (order._id || order.id) === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status. Please try again.');
      // Simple fallback could be fetching orders again on failure
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 pb-12">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const orderId = order._id || order.id;
                return (
                  <tr key={orderId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{orderId.substring(orderId.length - 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <p className="font-medium text-gray-900">{order.customerName || 'Guest'}</p>
                      <p className="text-xs truncate">{order.deliveryAddress || 'No Address'}</p>
                      <p className="text-xs">{order.customerPhone || 'No Phone'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {order.products && order.products.length > 0 
                        ? order.products.map(item => `${item.quantity}x ${item.product?.name || 'Item'}`).join(', ') 
                        : 'No products'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                      ₹{order.totalPrice ? Number(order.totalPrice).toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(orderId, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 outline-none cursor-pointer border-r-8 border-transparent focus:ring-2 focus:ring-indigo-500
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
