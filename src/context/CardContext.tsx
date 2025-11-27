"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "@/lib/cart";

interface CartContextProps {
  cart: Record<string, number>;
  cartCount: number;
  refreshCart: () => void;
  addItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
}

const CartContext = createContext<CartContextProps | null>(null);

export const CartProvider = ({ children }: any) => {
  const { user } = useUser();
  const userId = user?.id;

  const [cart, setCart] = useState<Record<string, number>>({});

  const refreshCart = async () => {
    if (!userId) return;
    const data = await getCart(userId);
    setCart(data);
  };

  useEffect(() => {
    refreshCart();
  }, [userId]);

  const addItem = async (productId: string) => {
    if (!userId) return alert("Please log in");
    await addToCart(userId, productId);
    refreshCart();
  };

  const updateQty = async (productId: string, qty: number) => {
    if (!userId) return;
    await updateCartQuantity(userId, productId, qty);
    refreshCart();
  };

  const removeItem = async (productId: string) => {
    if (!userId) return;
    await removeFromCart(userId, productId);
    refreshCart();
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        refreshCart,
        addItem,
        updateQty,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;
