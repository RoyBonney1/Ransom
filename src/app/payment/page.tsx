"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useUser();

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cardType, setCardType] = useState("");
  const [cardInfo, setCardInfo] = useState<any>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    // Load order details from sessionStorage
    const details = sessionStorage.getItem("orderDetails");
    if (!details) {
      toast.error("No order found. Please go back to cart.");
      router.push("/cart");
      return;
    }
    setOrderDetails(JSON.parse(details));
  }, [router]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  // Luhn algorithm to validate card number
  const isValidCardNumber = (cardNumber: string) => {
    const digits = cardNumber.replace(/\s/g, "");

    if (!/^\d{13,19}$/.test(digits)) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Detect card type
  const detectCardType = (cardNumber: string) => {
    const digits = cardNumber.replace(/\s/g, "");

    if (/^4/.test(digits)) return "Visa";
    if (/^5[1-5]/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "American Express";
    if (/^6(?:011|5)/.test(digits)) return "Discover";

    return "Unknown";
  };

  // Validate expiry date
  const isValidExpiryDate = (expiryDate: string) => {
    const [month, year] = expiryDate.split("/");

    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt("20" + year, 10);

    if (monthNum < 1 || monthNum > 12) {
      return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (yearNum < currentYear) {
      return false;
    }

    if (yearNum === currentYear && monthNum < currentMonth) {
      return false;
    }

    return true;
  };

  // Advanced card validation using BIN lookup
  const validateCardAdvanced = async (cardNumber: string) => {
    const bin = cardNumber.replace(/\s/g, "").slice(0, 6);

    if (bin.length < 6) return null;

    setValidating(true);

    try {
      const response = await fetch(`https://lookup.binlist.net/${bin}`);

      if (!response.ok) {
        setValidating(false);
        return null;
      }

      const data = await response.json();

      setValidating(false);

      return {
        valid: true,
        brand: data.scheme?.toUpperCase() || "Unknown",
        type: data.type || "Unknown",
        bank: data.bank?.name || "Unknown",
        country: data.country?.name || "Unknown",
        prepaid: data.prepaid,
      };
    } catch (error) {
      setValidating(false);
      return null;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
      setCardType(detectCardType(formatted));

      // Perform advanced validation when we have at least 6 digits
      if (formatted.replace(/\s/g, "").length >= 6) {
        validateCardAdvanced(formatted).then((info) => {
          if (info) {
            setCardInfo(info);
          }
        });
      } else {
        setCardInfo(null);
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, "").length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast.error("Please fill in all payment details");
      return;
    }

    if (!isValidCardNumber(cardNumber)) {
      toast.error("Invalid card number. Please enter a valid one.");

      return;
    }

    if (!isValidExpiryDate(expiryDate)) {
      toast.error(
        "Invalid expiry date. The card may be expired or the format is incorrect."
      );
      ``;

      return;
    }

    if (cvv.length !== 3) {
      toast.error("Please enter a valid 3-digit CVV");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Clear order details
      sessionStorage.removeItem("orderDetails");

      toast.success("Payment successful! Your order has been placed.");
      router.push("/prank");
      setProcessing(false);
    }, 2000);
  };

  if (!orderDetails) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Payment Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT - Payment Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Enter Card Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {validating && (
                    <span className="absolute right-3 top-3 text-sm text-gray-400">
                      Validating...
                    </span>
                  )}
                  {!validating && cardType && cardType !== "Unknown" && (
                    <span className="absolute right-3 top-3 text-sm text-gray-500 font-medium">
                      {cardType}
                    </span>
                  )}
                </div>

                {/* Card Info Display */}
                {cardInfo && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm space-y-1">
                    <p className="text-blue-900">
                      <span className="font-medium">Type:</span>{" "}
                      {cardInfo.brand} {cardInfo.type}
                    </p>
                    {cardInfo.bank !== "Unknown" && (
                      <p className="text-blue-900">
                        <span className="font-medium">Bank:</span>{" "}
                        {cardInfo.bank}
                      </p>
                    )}
                    <p className="text-blue-900">
                      <span className="font-medium">Country:</span>{" "}
                      {cardInfo.country}
                    </p>
                    {cardInfo.prepaid !== undefined && (
                      <p className="text-blue-900">
                        <span className="font-medium">Prepaid:</span>{" "}
                        {cardInfo.prepaid ? "Yes" : "No"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
              >
                {processing ? "Processing..." : `Pay $${orderDetails.total}`}
              </button>
            </form>
          </div>

          {/* RIGHT - Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="pb-4 border-b">
                <h3 className="font-medium mb-2">Delivery Address</h3>
                <p className="text-sm text-gray-600">
                  {orderDetails.address.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {orderDetails.address.area}
                </p>
                <p className="text-sm text-gray-600">
                  {orderDetails.address.city}, {orderDetails.address.state}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-600">
                    Items ({orderDetails.cartCount})
                  </p>
                  <p className="font-medium">${orderDetails.cartAmount}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">Tax (2%)</p>
                  <p className="font-medium">${orderDetails.tax}</p>
                </div>

                <div className="flex justify-between pt-4 border-t text-lg font-semibold">
                  <p>Total</p>
                  <p>${orderDetails.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
