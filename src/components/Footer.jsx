import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center space-x-2 text-white font-bold text-lg mb-3">
                        <span className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-sm font-black">
                            M
                        </span>
                        <span>ModernStore</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        Full-stack e-commerce project built with React, Node.js, Express, and Supabase.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link className="hover:text-white transition" to="/">Home</Link></li>
                        <li><Link className="hover:text-white transition" to="/products">Catalog</Link></li>
                        <li><Link className="hover:text-white transition" to="/cart">Cart</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link className="hover:text-white transition" to="/login">Sign In</Link></li>
                        <li><Link className="hover:text-white transition" to="/orders">My Orders</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Architecture</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Client-side Vite single-page application with Express API price recalculation and Supabase PostgreSQL.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} ModernStore. All rights reserved.
            </div>
        </footer>
    );
}