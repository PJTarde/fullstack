import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, MapPin, User as UserIcon, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/hariom-logo.png"
            alt="Hariom Bakers"
            className="h-10 w-auto"
          />

          <div>
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">
              Hariom Bakers
            </h1>

            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Sambhaji Nagar
            </p>
          </div>
        </Link>

        {/* Menu Section */}
        <div className="flex items-center gap-6">
          <Link
            to="/menu"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Menu
          </Link>

          <Link
            to="/customize"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Custom Cake
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-warm-brown-light"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Auth */}
          {user ? (
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary h-10">
                <UserIcon className="h-4 w-4" />
                Hi, {user.name ? user.name.split(' ')[0] : 'User'}
              </button>
              {/* Invisible padding wrapper prevents hover drop-off gap */}
              <div className="absolute right-0 pt-2 w-36 origin-top-right hidden group-hover:block z-50">
                <div className="rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-border">
                  <Link
                    to="/account"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 text-left font-medium transition-colors border-b border-border"
                  >
                    <UserIcon className="h-4 w-4" />
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:block border border-primary/20 rounded-full px-5 py-2 hover:bg-primary/5"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
