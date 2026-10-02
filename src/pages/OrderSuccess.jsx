import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function OrderSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Order Confirmed!</h1>
            <p className="text-slate-600 text-sm mt-2">
                Thank you for your purchase. We have received your order and dispatched an itemized receipt to your email address.
            </p>

            {orderId && (
                <div className="mt-6 inline-block bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg text-xs font-mono text-slate-700">
                    Order Reference: <span className="font-bold text-slate-900">{orderId}</span>
                </div>
            )}

            <div className="mt-8 flex justify-center space-x-4">
                <Link className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition" to="/products">
                    <span>Continue Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}