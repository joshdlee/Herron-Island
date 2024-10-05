// src/CartContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  sizes: Size[];
  size?: string;
  quantity?: number;
}

interface Size {
  size: string;
  stock: number;
}

interface CartContextProps {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string, size: string) => {
    const index = cart.findIndex(item => item.id === productId && item.size === size);
    if (index >= 0) {
      setCart(cart.filter((_, i) => i !== index));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
