"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getAddresses, saveAddress } from "@/lib/addresses";
import toast, { Toaster } from "react-hot-toast";

interface OrderSummaryProps {
  getCartCount: () => number;
  getCartAmount: () => number;
}

export default function OrderSummary({
  getCartCount,
  getCartAmount,
}: OrderSummaryProps) {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const [isAdding, setIsAdding] = useState(false);

  // New address fields
  const [fullName, setFullName] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Load addresses from Firestore
  const loadAddresses = async () => {
    if (!userId) return;
    const list = await getAddresses(userId);
    setAddresses(list);
  };

  // Save new address
  const handleAddAddress = async () => {
    if (!fullName || !area || !city || !state)
      return toast.error("Please fill all fields");

    await saveAddress(userId!, {
      fullName,
      area,
      city,
      state,
    });

    setIsAdding(false);
    setFullName("");
    setArea("");
    setCity("");
    setState("");

    loadAddresses();
  };

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  const handlePlaceOrder = () => {
    // Check if cart has items
    if (getCartCount() === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    // Check if address is selected
    if (!selectedAddress || selectedAddress.id === "add") {
      alert("Please select a delivery address before placing your order.");
      return;
    }

    // Store order details in sessionStorage for payment page
    sessionStorage.setItem(
      "orderDetails",
      JSON.stringify({
        address: selectedAddress,
        cartCount: getCartCount(),
        cartAmount: getCartAmount(),
        tax: Math.floor(getCartAmount() * 0.02),
        total: getCartAmount() + Math.floor(getCartAmount() * 0.02),
      })
    );

    // Navigate to payment page
    router.push("/payment");
  };

  return (
    <div className="w-full md:w-96 bg-gray-100 p-5 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700">Order Summary</h2>
      <hr className="my-4" />

      {/* ADDRESS SELECTOR */}
      <div className="mb-5">
        <label className="font-medium text-gray-600 block mb-2">
          Delivery Address
        </label>

        {addresses.length === 0 && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full border py-2 rounded-md"
          >
            + Add Address
          </button>
        )}

        {/* SELECT ADDRESS */}
        {addresses.length > 0 && !isAdding && (
          <select
            className="w-full border p-2 rounded-md"
            value={selectedAddress?.id || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "add") {
                setSelectedAddress(null);
                setIsAdding(true);
                return;
              }

              const found = addresses.find((a) => a.id === value) || null;
              setSelectedAddress(found);
            }}
          >
            <option value="" disabled>
              Select an address
            </option>

            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.fullName}, {addr.area}, {addr.city}, {addr.state}
              </option>
            ))}

            <option value="add">+ Add New Address</option>
          </select>
        )}

        {/* ADD NEW ADDRESS FORM */}
        {isAdding && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="border w-full px-3 py-2 rounded"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Street / Area"
              className="border w-full px-3 py-2 rounded"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              className="border w-full px-3 py-2 rounded"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              className="border w-full px-3 py-2 rounded"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={handleAddAddress}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* SUMMARY */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <p>Items ({getCartCount()})</p>
          <p>${getCartAmount()}</p>
        </div>
        <div className="flex justify-between">
          <p>Tax (2%)</p>
          <p>${Math.floor(getCartAmount() * 0.02)}</p>
        </div>

        <div className="flex justify-between text-lg font-semibold border-t pt-3">
          <p>Total</p>
          <p>${getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-black text-white py-3 mt-6 rounded-lg hover:bg-gray-800"
      >
        Place Order
      </button>
    </div>
  );
}
