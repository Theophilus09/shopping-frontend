import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setErrorMsg(null);

            try {
                // Use select('*') so nonexistent column names won't break the query
                let query = supabase
                    .from('orders')
                    .select('*, order_items(*, products(*))');

                if (user.id && user.email) {
                    query = query.or(`user_id.eq.${user.id},email.eq.${user.email}`);
                } else if (user.id) {
                    query = query.eq('user_id', user.id);
                } else if (user.email) {
                    query = query.eq('email', user.email);
                }

                const { data, error } = await query.order('created_at', { ascending: false });

                if (error) {
                    // If nested order_items join fails, fallback to fetching base orders
                    console.warn('Falling back to basic orders select:', error.message);
                    const fallback = await supabase
                        .from('orders')
                        .select('*')
                        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
                        .order('created_at', { ascending: false });

                    if (fallback.error) throw fallback.error;
                    setOrders(fallback.data || []);
                } else {
                    setOrders(data || []);
                }
            } catch (err) {
                console.error('Failed to fetch user orders:', err);
                setErrorMsg('Unable to retrieve your order history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-500">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
                <p className="mt-4">Loading your purchases...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 text-center text-rose-600">
                <p>{errorMsg}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
                <p className="text-sm text-slate-500 mt-1">Review past purchases and shipping status.</p>
            </header>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">No orders found</h2>
                    <p className="text-sm text-slate-500 mt-1 mb-6">Orders placed with your account will appear here.</p>
                    <Link
                        to="/catalog"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        Browse Products &rarr;
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const displayTotal = order.total_amount ?? order.total ?? order.total_price ?? order.amount ?? 0;

                        return (
                            <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <span className="block text-xs uppercase text-slate-400 font-semibold tracking-wider">Date Placed</span>
                                            <span className="font-medium text-slate-700">
                                                {new Date(order.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase text-slate-400 font-semibold tracking-wider">Total</span>
                                            <span className="font-medium text-slate-900">${Number(displayTotal).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500 font-mono">ID: {order.id?.slice(0, 8)}</span>
                                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 capitalize">
                                            {order.status || 'Confirmed'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 divide-y divide-slate-100">
                                    {order.order_items && order.order_items.length > 0 ? (
                                        order.order_items.map((item) => (
                                            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    {item.products?.image_url && (
                                                        <img
                                                            src={item.products.image_url}
                                                            alt={item.products.name}
                                                            className="w-14 h-14 object-cover rounded-md border border-slate-200"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-slate-800 text-sm">{item.products?.name || 'Product'}</p>
                                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">
                                                    ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-slate-500 py-2">
                                            <p>Recipient: <strong className="text-slate-700">{order.customer_name || order.email}</strong></p>
                                            <p className="text-xs text-slate-400 mt-1">Delivery Address: {order.address || 'Standard Shipping'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}