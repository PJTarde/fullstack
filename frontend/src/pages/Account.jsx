import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Mail, LogOut, Package, Edit2, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/axios";

const Account = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.put("/users/profile", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      login(data); // update local storage and context
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10 px-4 min-h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold mb-8">My Account</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-200">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Account Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    <Edit2 className="h-4 w-4" /> Edit
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name,
                        email: user?.email,
                        phone: user?.phone,
                        address: user?.address,
                      });
                      setError("");
                    }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                )}
              </div>
              
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex flex-col border-b border-border pb-4">
                    <span className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </span>
                    <span className="font-medium">{user.name}</span>
                  </div>

                  <div className="flex flex-col border-b border-border pb-4">
                    <span className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email Address
                    </span>
                    <span className="font-medium">{user.email}</span>
                  </div>

                  <div className="flex flex-col border-b border-border pb-4">
                    <span className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone Number
                    </span>
                    <span className="font-medium">{user.phone || "Not provided"}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Delivery Address
                    </span>
                    <span className="font-medium">{user.address || "Not provided"}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name} 
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" 
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email Address
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email} 
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed" 
                      disabled
                      title="Email cannot be changed directly"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone Number
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone} 
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" 
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Delivery Address
                    </label>
                    <textarea 
                      name="address"
                      value={formData.address} 
                      onChange={handleEditChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" 
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="mt-4 flex items-center justify-center gap-2 w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              )}
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Recent Orders
              </h2>
              <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-xl border border-dashed border-border">
                <p>Order history will appear here soon.</p>
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-semibold mb-4 text-primary">Quick Actions</h3>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-100 hover:bg-red-50 hover:border-red-200 py-3 px-4 rounded-xl font-medium transition-all shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
