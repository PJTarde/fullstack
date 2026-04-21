import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import api from '../api/axios';

/* Razorpay global declaration */

/* Load Razorpay script */
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [payment, setPayment] = useState("online");

  const { user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  /* Razorpay Payment / COD Processing */
  const handleOrder = async () => {
    // 1. Build Payload
    const orderPayload = {
      products: items.map(item => ({
        product: item.id,
        quantity: item.quantity
      })),
      totalPrice: totalAmount + 25,
      customerName: user.name,
      customerPhone: user.phone,
      deliveryAddress: user.address
    };

    // 2. If Cash on Delivery, bypass Razorpay entirely
    if (payment === "cod") {
      try {
        const response = await api.post("/orders", orderPayload);
        localStorage.setItem("customerName", user.name);
        clearCart();
        navigate("/track-order", { state: { orderId: response.data._id } });
      } catch (error) {
        console.error("Failed to save COD order:", error);
        alert("Order failed to save. Please try again.");
      }
      return;
    }

    // 3. Otherwise, do Online Razorpay flow
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay failed to load. Please check your connection.");
      return;
    }

    const options = {
      key: "rzp_test_SPBbEdJiqhWese",
      amount: (totalAmount + 25) * 100,
      currency: "INR",
      name: "Hariom Bakers",
      description: "Order Payment",

      handler: async function (response) {
        alert("Payment Successful!");

        console.log("Payment Response:", response);

        try {
          const response = await api.post("/orders", orderPayload);

          // Save customer name for reviews
          localStorage.setItem("customerName", user.name);

          clearCart();
          navigate("/track-order", { state: { orderId: response.data._id } });
        } catch (error) {
          console.error("Failed to save order to database:", error);
          alert("Payment succeeded but order tracking failed to save!");
        }
      },

      prefill: {
        name: user.name,
        email: user.email || "customer@example.com",
        contact: user.phone,
      },

      theme: {
        color: "#7c3aed",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (items.length === 0) {
    return null;
  }

  const paymentMethods = [
    { id: "online", label: "Online Payment", icon: "💳", desc: "UPI, Cards, NetBanking" },
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: "💵",
      desc: "Pay when you receive",
    },
  ];

  return (
    <div className="container max-w-2xl py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {" "}
        <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>
        ```
        {/* Delivery Details Overview */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-4">Delivery Details</h3>

          <div className="space-y-1 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Name:</strong> {user.name}</p>
            <p><strong className="text-foreground">Phone:</strong> {user.phone}</p>
            <p><strong className="text-foreground">Address:</strong> {user.address}</p>
          </div>
        </div>
        {/* Order Summary */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-3">Order Summary</h3>

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>

                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Packaging</span>
              <span>₹25</span>
            </div>

            <div className="border-t border-border pt-2 flex justify-between font-display font-bold">
              <span>Total</span>
              <span>₹{totalAmount + 25}</span>
            </div>
          </div>
        </div>
        {/* Payment Method */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-4">Payment Method</h3>

          <div className="space-y-2">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                  payment === m.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span className="text-xl">{m.icon}</span>

                <div>
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Place Order Button */}
        <button
          onClick={handleOrder}
          disabled={!user.address || !user.phone}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-warm-brown-light disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Place Order · ₹{totalAmount + 25}
        </button>
      </motion.div>
    </div>
  );
};

export default Checkout;
