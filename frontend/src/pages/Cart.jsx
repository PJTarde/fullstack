import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from '../api/axios';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="font-display text-xl font-bold mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Add some delicious items to get started
        </p>
        <Link
          to="/menu"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="font-display text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded border border-border bg-gray-50 flex items-center justify-center">
              {item.image ? (
                <img 
                  src={item.image.startsWith('/') ? `${API_BASE_URL}${item.image}` : item.image}  
                  alt={item.name} 
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=No+Img'; }}
                />
              ) : (
                <span className="text-2xl text-gray-400">?</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm font-semibold truncate">
                {item.name}
              </h3>
              {item.customization && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.customization}
                </p>
              )}
              <p className="font-display font-bold text-sm mt-1">
                ₹{item.price * item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bill */}
      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <h3 className="font-display font-semibold mb-3 text-sm">
          Bill Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Item Total</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery Fee</span>
            <span className="text-primary font-medium">FREE</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Packaging</span>
            <span>₹25</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-display font-bold">
            <span>To Pay</span>
            <span>₹{totalAmount + 25}</span>
          </div>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-4 block w-full rounded-xl bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-warm-brown-light"
      >
        Proceed to Checkout · ₹{totalAmount + 25}
      </Link>
    </div>
  );
};

export default Cart;
