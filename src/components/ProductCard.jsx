import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    if (!product) return null;

    return (
        <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {product.category}
                    </span>
                )}
            </Link>

            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <Link to={`/products/${product.id}`}>
                        <h3 className="font-semibold text-slate-800 text-base line-clamp-1 group-hover:text-indigo-600 transition">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {product.description}
                    </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 block">Price</span>
                        <span className="text-lg font-bold text-slate-900">${Number(product.price).toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => addToCart(product, 1)}
                        disabled={product.stock <= 0}
                        className="flex items-center space-x-1 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-300 text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{product.stock > 0 ? 'Add' : 'Out'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}