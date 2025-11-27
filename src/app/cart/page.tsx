"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import OrderSummary from "@/components/OrderSummary";

import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "@/lib/cart";
import { getSingleProduct } from "@/lib/getSingleProduct";

export default function CartPage() {
  const { user } = useUser();
  const userId = user?.id;

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart + fetch product details
  const loadCart = async () => {
    if (!userId) return;

    const cart = await getCart(userId);

    const detailed = await Promise.all(
      Object.keys(cart).map(async (productId) => {
        const product = await getSingleProduct(productId);
        return {
          ...product,
          quantity: cart[productId],
        };
      })
    );

    setCartItems(detailed);
    setLoading(false);
  };

  // Quantity updates
  const handleDecrease = async (id: string, qty: number) => {
    if (!userId) return;
    await updateCartQuantity(userId, id, qty - 1);
    loadCart();
  };

  const handleIncrease = async (id: string) => {
    if (!userId) return;
    await addToCart(userId, id);
    loadCart();
  };

  const handleRemove = async (id: string) => {
    if (!userId) return;
    await removeFromCart(userId, id);
    loadCart();
  };

  // Helper functions for OrderSummary
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.offerPrice * item.quantity,
      0
    );
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <>
      <div className="px-6 md:px-16 lg:px-32 py-10 flex flex-col md:flex-row gap-14">
        {/* LEFT — CART ITEMS */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border rounded-lg p-4 gap-4"
                >
                  {/* IMAGE + NAME */}
                  <div className="flex items-center gap-4 flex-1">
                    <Image
                      src={item.images[0]}
                      width={90}
                      height={90}
                      alt={item.name}
                      className="rounded-lg object-cover"
                    />

                    <div>
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-gray-600">${item.offerPrice}</p>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-2 min-w-[120px] justify-center">
                    <button
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* SUBTOTAL */}
                  <p className="w-24 text-right font-semibold">
                    ${(item.offerPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <OrderSummary
          getCartCount={getCartCount}
          getCartAmount={getCartAmount}
        />
      </div>
    </>
  );
}
