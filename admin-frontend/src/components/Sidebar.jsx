import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Orders', path: '/orders' },
    { name: 'Products', path: '/products' },
    { name: 'Account', path: '/account' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider">ADMIN</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-4 py-2 rounded-md transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="w-full block text-center text-sm text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
