import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { supabase } from './services/supabaseClient';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';

export default function App() {
  useEffect(() => {
    let listenerHandle;

    const setupListener = async () => {
      listenerHandle = await CapacitorApp.addListener('appUrlOpen', async (data) => {
        // Intercept OAuth/Magic link callback tokens on mobile
        if (data.url.includes('#access_token') || data.url.includes('?code=')) {
          const url = new URL(data.url.replace('#', '?'));
          const access_token = url.searchParams.get('access_token');
          const refresh_token = url.searchParams.get('refresh_token');

          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token
            });
          }
        }
      });
    };

    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={<MyOrders />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}