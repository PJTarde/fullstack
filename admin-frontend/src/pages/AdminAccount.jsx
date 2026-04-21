import { useAdminAuth } from "../contexts/AdminAuthContext";
import { motion } from "framer-motion";
import { Shield, Mail, Key, UserCheck } from "lucide-react";

export default function AdminAccount() {
  const { adminUser } = useAdminAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Account</h1>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-24"></div>
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-12 left-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <div className="h-20 w-20 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <Shield className="h-10 w-10" />
            </div>
          </div>
          
          <div className="pt-12">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">System Administrator</h2>
              <UserCheck className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-gray-500 flex items-center gap-2">
              <Mail className="h-4 w-4" /> {adminUser?.email || "Super Admin"}
            </p>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account Settings</h3>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Role Permissions</p>
                <p className="text-sm text-gray-500">Full access to orders, products, and analytics</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between opacity-50 cursor-not-allowed">
              <div>
                <p className="font-medium text-gray-900 flex items-center gap-2">Update Password <Key className="h-4 w-4" /></p>
                <p className="text-sm text-gray-500">Change your administrative password</p>
              </div>
              <button disabled className="text-sm font-medium text-gray-400">Coming Soon</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
