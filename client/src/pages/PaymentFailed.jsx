import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">

      {/* CARD */}
      <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl overflow-hidden">

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent blur-2xl"></div>

        <div className="relative z-10">

          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 p-6 rounded-full shadow-lg">
              <FaTimesCircle className="text-red-400 text-6xl animate-pulse" />
            </div>
          </div>

          {/* TEXT */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Payment Failed ❌
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            We couldn’t process your payment.  
            Please check your details or try again.
          </p>

          {/* CTA */}
          <div className="space-y-4">

            <Link
              to="/"
              className="block w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition shadow-lg"
            >
              Try Again
            </Link>

            <Link
              to="/dashboard"
              className="block w-full py-3 rounded-lg font-semibold border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
            >
              Go to Dashboard
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;