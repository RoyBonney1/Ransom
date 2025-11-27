"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PrankPage() {
  const router = useRouter();
  const [showTips, setShowTips] = useState(false);

  const securityTips = [
    {
      title: "🔒 Check for HTTPS",
      description:
        "Always ensure the website URL starts with 'https://' and has a padlock icon. This means the connection is encrypted.",
    },
    {
      title: "🏢 Verify the Company",
      description:
        "Research the company before making purchases. Check reviews, social media presence, and how long they've been in business.",
    },
    {
      title: "💳 Use Secure Payment Methods",
      description:
        "Use credit cards or trusted payment services like PayPal, Apple Pay, or Google Pay. Avoid wire transfers or gift cards.",
    },
    {
      title: "🎣 Watch for Phishing",
      description:
        "Be suspicious of emails or texts with urgent payment requests. Legitimate companies won't pressure you or ask for sensitive info via email.",
    },
    {
      title: "🔍 Check Website Quality",
      description:
        "Professional scam sites can look real, but often have poor grammar, spelling errors, or suspiciously low prices.",
    },
    {
      title: "🛡️ Enable Two-Factor Authentication",
      description:
        "Use 2FA on all accounts with financial information. This adds an extra layer of security even if passwords are compromised.",
    },
    {
      title: "📱 Keep Software Updated",
      description:
        "Regularly update your browser, OS, and security software to protect against known vulnerabilities.",
    },
    {
      title: "🚫 Don't Save Payment Info",
      description:
        "Avoid saving credit card details on websites unless you completely trust them and use them frequently.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full">
        {/* Main Prank Message */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center mb-8 border-4 border-red-500">
          <div className="text-6xl mb-6 animate-bounce">⚠️</div>

          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
            GOTCHA! 🎉
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            You just gave away your personal and card information!
          </p>

          <div className="bg-green-100 border-2 border-green-500 rounded-xl p-6 mb-6">
            <p className="text-lg text-green-800 font-semibold mb-2">
              ✅ Don't worry - we didn't save anything!
            </p>
            <p className="text-gray-700">
              This was a demonstration to show how easy it is to fall for fake
              payment pages. Your information was never stored or transmitted
              anywhere.
            </p>
          </div>

          <p className="text-lg text-gray-600 mb-8">
            But what if this was a real scam? Let's learn how to protect
            yourself online.
          </p>

          <button
            onClick={() => setShowTips(!showTips)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            {showTips ? "Hide" : "Show"} Security Tips 🛡️
          </button>
        </div>

        {/* Security Tips Section */}
        {showTips && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              How to Protect Yourself Online
            </h2>

            <div className="space-y-4 mb-8">
              {securityTips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-700">{tip.description}</p>
                </div>
              ))}
            </div>

            {/* Video Resource */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                📺 Learn More About Online Safety
              </h3>
              <p className="text-gray-700 mb-4">
                Watch this comprehensive guide on how to spot and avoid online
                scams:
              </p>
              <a
                href="https://www.youtube.com/watch?v=1fQ-eTneHHU"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
              >
                Watch Security Guide on YouTube →
              </a>
              <p className="text-sm text-gray-600 mt-3">
                This video covers phishing scams, fake websites, and how to shop
                safely online.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all"
          >
            Go Back Home
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem("orderDetails");
              router.push("/cart");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all"
          >
            Back to Cart
          </button>
        </div>

        {/* Educational Footer */}
        <div className="mt-8 text-center text-gray-600 bg-white rounded-xl p-6 shadow">
          <p className="text-sm">
            <strong>Remember:</strong> If something seems too good to be true,
            it probably is. Always verify websites before entering sensitive
            information, and when in doubt, contact the company directly through
            official channels.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
