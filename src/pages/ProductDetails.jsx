import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        async function loadProduct() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (!error && data) {
                    setProduct(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    const handleAdd = () => {
        if (product && product.stock > 0) {
            addToCart(product, quantity);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
                <Link className="mt-4 inline-block text-indigo-600 font-semibold underline" to="/products">
                    Return to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8" to="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Catalog
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="space-y-6">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md uppercase tracking-wider">
                        {product.category}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        {product.name}
                    </h1>
                    <p className="text-2xl font-bold text-indigo-600">
                        ${Number(product.price).toFixed(2)}
                    </p>
                    <div className="border-t border-b border-slate-200 py-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex items-center space-x-3 text-sm">
                        <span className="font-semibold text-slate-700">Stock Availability:</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                        </span>
                    </div>

                    {product.stock > 0 && (
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-semibold text-slate-700">Quantity</span>
                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1.5 text-sm font-semibold text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAdd}
                                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-semibold transition"
                            >
                                {added ? (
                                    <>
                                        <Check className="w-5 h-5 text-white" />
                                        <span>Added to Cart!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Add {quantity} to Cart</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}