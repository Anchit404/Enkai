import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import CountdownTimer from "../components/CountdownTimer";
import SeatAvailabilityBar from "../components/SeatAvailabilityBar";
import { AnimatedButton } from "../components/AnimatedButton";
import { EventDetailSkeleton } from "../components/SkeletonLoaders";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { CategoryBadge } from "../components/EventBadge";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  // Load favorite status
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("enkai_favorites") || "[]");
    setIsFavorite(favorites.includes(id));
  }, [id]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
        // Track recently viewed
        const recentlyViewed = JSON.parse(
          localStorage.getItem("enkai_recently_viewed") || "[]"
        );
        const updated = [data, ...recentlyViewed.filter((e) => e._id !== data._id)].slice(
          0,
          10
        );
        localStorage.setItem("enkai_recently_viewed", JSON.stringify(updated));
      } catch (err) {
        setError("Failed to load event details.");
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book");
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        const res = await api.post("/bookings/send-otp");
        setShowOTP(true);
        toast.success(`OTP sent to ${res.data?.email || user?.email || "your email"}`);
        setSuccessMsg(`OTP sent to: ${res.data?.email || user?.email || "your email"}`);
      } else {
        await api.post("/bookings", { eventId: event._id, otp: otp.trim() });
        toast.success("Booking requested! Awaiting confirmation.");
        setSuccessMsg("Booking requested! Awaiting confirmation.");
        setShowOTP(false);
        setBookingSuccess(true);
        setEvent({
          ...event,
          availableSeats: event.availableSeats - 1,
        });
      }
    } catch (err) {
      console.error("Booking error details:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || "Booking failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("enkai_favorites") || "[]");
    if (isFavorite) {
      const updated = favorites.filter((fav) => fav !== id);
      localStorage.setItem("enkai_favorites", JSON.stringify(updated));
      toast.success("Removed from favorites");
    } else {
      favorites.push(id);
      localStorage.setItem("enkai_favorites", JSON.stringify(favorites));
      toast.success("Added to favorites");
    }
    setIsFavorite(!isFavorite);
  };

  const shareEvent = () => {
    navigator.clipboard.writeText(`${window.location.origin}/events/${id}`);
    toast.success("Link copied to clipboard!");
  };

  if (loading) return <EventDetailSkeleton />;

  if (error && !event)
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FaTicketAlt className="text-4xl text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Event Not Found</h2>
          <p className="text-gray-400 mb-6">The event you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
          >
            <FaArrowLeft /> Back to Events
          </Link>
        </motion.div>
      </div>
    );

  const isSoldOut = event.availableSeats <= 0;
  const isAlmostFull = event.availableSeats <= 20 && event.availableSeats > 0;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Back Button & Actions */}
      <div className="fixed top-20 left-6 md:left-16 z-30 flex items-center gap-3">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-gray-700 px-4 py-2 rounded-full text-sm hover:bg-black/70 transition-colors"
        >
          <FaArrowLeft /> Back
        </motion.button>
      </div>

      <div className="fixed top-20 right-6 md:right-16 z-30 flex items-center gap-3">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFavorite}
          className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
            isFavorite
              ? "bg-red-500/20 border border-red-500/50 text-red-500"
              : "bg-black/50 border border-gray-700 text-white hover:bg-black/70"
          }`}
        >
          <FaHeart className={isFavorite ? "fill-current" : ""} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareEvent}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-gray-700 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <FaShare />
        </motion.button>
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[500px] w-full overflow-hidden"
      >
        <motion.img
          src={event.imageUrl}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-16"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <CategoryBadge category={event.category} />
              {isAlmostFull && (
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full flex items-center gap-1">
                  <FaClock className="animate-pulse" /> Only {event.availableSeats} left
                </span>
              )}
              {isSoldOut && (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-3xl leading-tight">
              {event.name}
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl line-clamp-2">
              {event.description}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          {/* LEFT INFO */}
          <div className="md:col-span-2 space-y-6">
            {/* Countdown Timer */}
            <CountdownTimer targetDate={event.date} />

            {/* Event Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FaTicketAlt className="text-purple-400" /> Event Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 text-gray-300">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <FaCalendarAlt className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-pink-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <FaChair className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Seats</p>
                    <p className="font-medium">
                      {event.availableSeats} / {event.totalSeats} available
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <FaMoneyBillWave className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">
                      {event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl"
            >
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </motion.div>
          </div>

          {/* RIGHT - BOOKING CARD */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl sticky top-24"
            >
              <h3 className="text-xl font-semibold mb-6">Book Your Spot</h3>

              {/* Seat Availability Bar */}
              <SeatAvailabilityBar
                available={event.availableSeats}
                total={event.totalSeats}
              />

              {/* Price Display */}
              <div className="flex items-center justify-between py-4 border-b border-gray-800 mb-6">
                <span className="text-gray-400">Ticket Price</span>
                <span className="text-2xl font-bold">
                  {event.ticketPrice === 0 ? (
                    <span className="text-green-400">Free</span>
                  ) : (
                    <span className="text-purple-400">₹{event.ticketPrice}</span>
                  )}
                </span>
              </div>

              {/* OTP Input */}
              <AnimatePresence>
                {showOTP && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <label className="text-sm text-gray-400 mb-2 block">
                      Enter OTP sent to your email
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="------"
                      className="w-full px-4 py-4 rounded-xl bg-[#0f0f0f] border border-gray-700 text-center text-xl tracking-[0.5em] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Animation */}
              <AnimatePresence>
                {bookingSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-green-400 font-medium">Booking Successful!</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Check your dashboard for details
                    </p>
                    <Link
                      to="/dashboard"
                      className="inline-block mt-3 text-sm text-purple-400 hover:text-purple-300"
                    >
                      View My Bookings →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm mb-4 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Book Button */}
              {!bookingSuccess && (
                <AnimatedButton
                  onClick={handleBooking}
                  disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                  loading={bookingLoading}
                  variant={isSoldOut ? "secondary" : "primary"}
                  className="w-full"
                >
                  {isSoldOut
                    ? "Sold Out"
                    : showOTP
                    ? "Verify & Confirm"
                    : "Book Now"}
                </AnimatedButton>
              )}

              {/* Info Text */}
              {!showOTP && !bookingSuccess && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  {isSoldOut
                    ? "This event is currently sold out"
                    : "You'll receive an OTP to confirm your booking"}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;