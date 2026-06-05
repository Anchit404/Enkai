import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
      } else {
        await verifyOtp(email, otp);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">

      {/* CARD */}
      <div className="w-full max-w-md bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 shadow-2xl">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Join{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              ENKAI
            </span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Create your account and start exploring events
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg mb-6 text-center text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {!showOTP ? (
            <>
              {/* NAME */}
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 px-4 py-3 rounded-lg bg-[#0f0f0f] border border-gray-800 focus:border-purple-500 focus:outline-none text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  required
                  className="w-full mt-1 px-4 py-3 rounded-lg bg-[#0f0f0f] border border-gray-800 focus:border-purple-500 focus:outline-none text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-400">Password</label>
                <input
                  type="password"
                  required
                  className="w-full mt-1 px-4 py-3 rounded-lg bg-[#0f0f0f] border border-gray-800 focus:border-purple-500 focus:outline-none text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 p-3 rounded-lg mb-4 text-center">
                OTP sent to your email. Verify to continue.
              </p>

              <label className="text-sm text-gray-400">Enter OTP</label>
              <input
                type="text"
                required
                maxLength="6"
                placeholder="------"
                className="w-full mt-2 px-4 py-3 rounded-lg bg-[#0f0f0f] border border-gray-800 focus:border-purple-500 focus:outline-none text-white text-center tracking-[0.5em] text-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
          >
            {loading
              ? "Processing..."
              : showOTP
              ? "Verify & Continue"
              : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        {!showOTP && (
          <p className="text-center mt-6 text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;