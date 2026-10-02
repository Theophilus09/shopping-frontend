import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
    const { cart, subtotal, clearCart } = useCart();
    const { user, session } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'United States'
    });

    // Keep email synced with the logged-in user
    useEffect(() => {
        if (user?.email) {
            setFormData((prev) => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const shippingFee = 15.00;
    const total = subtotal + shippingFee;

    // Safe redirect if cart is naturally empty on load
    useEffect(() => {
        if (cart.length === 0 && !loading) {
            navigate('/cart');
        }
    }, [cart, loading, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const payload = {
                user_id: user?.id || null, // <--- Add this line
                customer_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                items: cart.map((item) => ({
                    product_id: Number(item.id),
                    quantity: Number(item.quantity)
                }))
            };

            const headers = {
                'Content-Type': 'application/json'
            };

            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const res = await fetch(`${apiUrl}/orders`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to place order.');
            }

            // Navigate first so the component unmounts before cart is emptied
            navigate(`/success?orderId=${data.order.id}`);
            clearCart();
        } catch (err) {
            setErrorMsg(err.message);
            setLoading(false);
        }
    };

    if (cart.length === 0 && !loading) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Checkout</h1>

            {errorMsg && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Shipping Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                            <input
                                required
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                            <input
                                required
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Country</label>
                            <input
                                required
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Street Address</label>
                        <input
                            required
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                            <input
                                required
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">State</label>
                            <input
                                required
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg">Order Details</h3>

                    <div className="divide-y divide-slate-200 max-h-56 overflow-y-auto pr-1">
                        {cart.map((item) => (
                            <div key={item.id} className="py-2 flex justify-between text-xs">
                                <span className="text-slate-700 font-medium truncate max-w-42.5">
                                    {item.quantity}x {item.name}
                                </span>
                                <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Shipping</span>
                            <span className="font-semibold">${shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-bold text-slate-900">
                            <span>Total Due</span>
                            <span className="text-indigo-600">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-semibold text-sm transition"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </form>
        </div>
    );
}