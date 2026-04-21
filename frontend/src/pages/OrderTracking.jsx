import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, Package, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for marker icons in React/Vite
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function OrderTracking() {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId || "");
  const [searchInput, setSearchInput] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let intervalId;
    if (orderId) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/orders/${orderId}`);
          setOrder(data);
          setError("");
          if (data.status === "Delivered" && !showFeedback) {
            setTimeout(() => setShowFeedback(true), 1500);
          }
        } catch (err) {
          setError(err.response?.data?.message || "Order not found");
          setOrder(null);
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
      // Poll every 10 seconds for live updates
      intervalId = setInterval(fetchOrder, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId]);

  const bakery = [19.8762, 75.3433];
  const rider = [19.8785, 75.3475];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-6">Track Your Order 🚴</h1>

      {/* Manual Search if no ID provided via redirect */}
      {!order && !orderId && (
        <div className="bg-white shadow-card p-6 rounded-xl mb-6 border border-border">
          <h2 className="text-lg font-semibold mb-3">Where is my cake?</h2>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Enter your Order ID..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 rounded-lg border border-border px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button 
              onClick={() => setOrderId(searchInput)}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Track
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      )}

      {/* Live Order Information */}
      {order && (
        <div className="bg-white shadow-card p-6 rounded-xl mb-6 border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <h1 className="text-8xl">📦</h1>
          </div>
          
          <div className="mb-4">
            <p className="text-sm border border-primary/20 bg-primary/5 text-primary tracking-wider uppercase font-semibold inline-block px-3 py-1 rounded-full mb-2">
              Status: {order.status}
            </p>
            <h2 className="text-xl font-bold font-display mt-2">Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h2>
            <p className="text-muted-foreground mt-1 text-sm">Placed for {order.customerName} at {order.deliveryAddress}</p>
          </div>

          <div className="border-t border-border mt-4 pt-4">
            <p className="font-semibold text-sm mb-2">Items:</p>
            <div className="grid gap-2">
              {order.products.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  <span>{item.quantity}x {item.product?.name || 'Unknown item'}</span>
                </div>
              ))}
            </div>
            <p className="font-bold text-lg mt-4 text-right border-t border-border pt-4">Total: ₹{order.totalPrice}</p>
          </div>
        </div>
      )}

      {/* Map */}

      <MapContainer
        center={bakery}
        zoom={14}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={bakery}>
          <Popup>Hariom Bakers</Popup>
        </Marker>

        <Marker position={rider}>
          <Popup>Delivery Rider</Popup>
        </Marker>
      </MapContainer>

      {/* Rating Section */}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Rate Delivery</h2>

        <div className="text-3xl cursor-pointer">⭐ ⭐ ⭐ ⭐ ⭐</div>
      </div>

      {/* Contact Bakery */}

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Need Help?</h3>

        <a
          href="tel:+918983344648"
          className="inline-block mt-3 bg-red-500 text-white px-4 py-2 rounded"
        >
          Contact Bakery
        </a>
      </div>
      {showFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Rate Your Delivery</h2>

            {/* Star Rating */}

            <div className="flex gap-2 text-3xl mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-3xl ${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Feedback */}

            <textarea
              placeholder="Write your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />

            {/* Submit */}

            <button
              onClick={() => {
                const oldReviews = JSON.parse(
                  localStorage.getItem("reviews") || "[]",
                );

                const customerName =
                  localStorage.getItem("customerName") || "Customer";

                const newReview = {
                  name: customerName,
                  rating,
                  feedback,
                  date: new Date().toLocaleDateString(),
                };

                localStorage.setItem(
                  "reviews",
                  JSON.stringify([...oldReviews, newReview]),
                );

                setShowFeedback(false);
              }}
              className="mt-4 w-full bg-primary text-white py-2 rounded-lg"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
