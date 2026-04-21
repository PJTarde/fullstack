import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function Navbar() {
  const { adminUser } = useAdminAuth();

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-10 w-full border-b border-gray-200">
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-600 hidden sm:block">
          {adminUser?.email || 'admin@example.com'}
        </span>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold uppercase">
          {adminUser?.email ? adminUser.email[0] : 'A'}
        </div>
      </div>
    </div>
  );
}
