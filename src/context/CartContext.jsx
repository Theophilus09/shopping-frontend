import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const stored = localStorage.getItem('shopping_cart');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('shopping_cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Failed to save cart to localStorage', e);
        }
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        if (!product || !product.id) {
            console.error('addToCart called without valid product:', product);
            return;
        }

        console.log('Adding to cart:', product.name, 'Qty:', quantity);

        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => String(item.id) === String(product.id));
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                };
                return updated;
            }
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name || 'Unnamed Product',
                    price: Number(product.price) || 0,
                    image_url: product.image_url || '',
                    category: product.category || 'General',
                    quantity: quantity
                }
            ];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                String(item.id) === String(productId) ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => String(item.id) !== String(productId)));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('shopping_cart');
    };

    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                subtotal,
                totalItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);