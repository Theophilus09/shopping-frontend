import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, subtotal } = useCart();
    const shippingFee = cart.length > 0 ? 15.00 : 0;
    const total = subtotal + shippingFee;

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
                <p className="text-slate-500 text-sm mt-1 mb-6">Explore the catalog to add items to your cart.</p>
                <Link className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition" to="/products">
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-slate-200"
                        >
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 text-sm truncate">{item.name}</h3>
                                <span className="text-xs text-slate-400">{item.category}</span>
                                <div className="text-sm font-bold text-indigo-600 mt-1">
                                    ${Number(item.price).toFixed(2)}
                                </div>
                            </div>

                            <div className="flex items-center border border-slate-200 rounded-md">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 text-xs font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 transition"
                                title="Remove Item"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg">Order Summary</h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Standard Shipping</span>
                            <span className="font-semibold text-slate-900">${shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
                            <span>Total</span>
                            <span className="text-indigo-600">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <Link className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold text-sm transition" to="/checkout">
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}