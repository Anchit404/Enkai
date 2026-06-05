import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">

      {/* CARD */}
      <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl overflow-hidden">

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent blur-2xl"></div>

        {/* ICON */}
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-6 rounded-full shadow-lg">
              <FaCheckCircle className="text-green-400 text-6xl animate-pulse" />
            </div>
          </div>

          {/* TEXT */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Booking Confirmed 🎉
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Your ticket has been successfully booked.  
            A confirmation email has been sent to you.
          </p>

          {/* CTA BUTTONS */}
          <div className="space-y-4">

            <Link
              to="/dashboard"
              className="block w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition shadow-lg"
            >
              View My Tickets
            </Link>

            <Link
              to="/"
              className="block w-full py-3 rounded-lg font-semibold border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
            >
              Explore More Events
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;