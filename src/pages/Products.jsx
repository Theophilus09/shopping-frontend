import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useCart } from '../context/CartContext';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) {
                    console.error('Supabase query error:', error);
                } else if (data) {
                    console.log('Fetched products:', data);
                    setProducts(data);
                }
            } catch (err) {
                console.error('Fetch exception:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

    const filtered = products.filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
            (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Store Catalog</h1>
                <p className="text-slate-500 text-sm mt-1">Browse our collection of performance gear.</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
                    <Filter className="w-4 h-4 text-slate-400 hidden sm:block mr-1" />
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${selectedCategory === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-600 font-medium">No products match your search.</p>
                    <button
                        onClick={() => { setSearch(''); setSelectedCategory('All'); }}
                        className="mt-3 text-sm text-indigo-600 font-semibold underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((product) => {
                        const price = Number(product.price) || 0;
                        const stock = typeof product.stock === 'number' ? product.stock : 10;
                        const imageUrl = product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

                        return (
                            <div
                                key={product.id}
                                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                            >
                                <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
                                    <img
                                        src={imageUrl}
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
                                            <span className="text-lg font-bold text-slate-900">${price.toFixed(2)}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(product, 1);
                                            }}
                                            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition shadow-sm active:scale-95"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}