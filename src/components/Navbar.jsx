import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { totalItemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-slate-900">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black">
              M
            </span>
            <span>ModernStore</span>
          </Link>

          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link to="/products" className="hover:text-indigo-600 transition">Catalog</Link>
            {user && (
              <Link to="/orders" className="hover:text-indigo-600 transition">My Orders</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-indigo-600 transition rounded-full hover:bg-slate-100"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-xs font-medium text-slate-500 max-w-32.5 truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 transition rounded-full hover:bg-slate-100"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-1 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-indigo-600 transition"
              >
                <User className="w-4 h-4 mr-1" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-50"
            >
              Catalog
            </Link>
            {user ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="block text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-50"
                >
                  My Orders
                </Link>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 truncate">{user.email}</span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="text-xs font-semibold text-rose-600"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-slate-900 text-white py-2 rounded-lg font-medium text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}