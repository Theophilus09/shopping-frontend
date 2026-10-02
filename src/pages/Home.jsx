import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../services/supabaseClient';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFeatured() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .limit(4);

                if (!error && data) {
                    setFeaturedProducts(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadFeatured();
    }, []);

    return (
        <div className="space-y-16 pb-16">
            <section className="relative bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase rounded-full">
                            Modern Everyday Gear
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                            Minimalist essentials built for work and life.
                        </h1>
                        <p className="text-slate-300 text-base max-w-lg leading-relaxed">
                            Explore premium audio, wearable tech, and streamlined desktop essentials designed for performance.
                        </p>
                        <div className="pt-2">
                            <Link className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition" to="/products">
                                <span>Shop All Items</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <img
                            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                            alt="Hero Product"
                            className="rounded-2xl shadow-xl object-cover h-96 w-full border border-slate-700"
                        />
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Flat Rate Express Delivery</h4>
                            <p className="text-xs text-slate-500 mt-1">Reliable shipping directly to your doorstep.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Server Price Verification</h4>
                            <p className="text-xs text-slate-500 mt-1">Secure checks directly through the Express backend.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                            <RefreshCw className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Transactional Receipts</h4>
                            <p className="text-xs text-slate-500 mt-1">Automatic itemized confirmations via Mailgun.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">Featured Gear</h2>
                        <p className="text-sm text-slate-500 mt-1">Handpicked selections from our catalog.</p>
                    </div>
                    <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center space-x-1">
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}