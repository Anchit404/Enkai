import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaTicketAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaClock,
  FaCompass,
} from "react-icons/fa";
import { DashboardSkeleton } from "../components/SkeletonLoaders";
import { AnimatedButton } from "../components/AnimatedButton";
import { StatusBadge } from "../components/EventBadge";

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
      </div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.replace("text-", "from-").replace("-400", "-500/20")} ${color.replace("text-", "to-").replace("-400", "-500/10")} flex items-center justify-center`}>
        <Icon className={`text-xl ${color}`} />
      </div>
    </div>
  </motion.div>
);

// Booking Timeline Card Component
const BookingCard = ({ booking, onCancel, index }) => {
  const isCancelled = booking.status === "cancelled";
  const isConfirmed = booking.status === "confirmed";
  const isPending = booking.status === "pending";

  const timelineSteps = [
    { label: "Requested", status: true, color: "bg-blue-500" },
    {
      label: "Confirmed",
      status: isConfirmed || isCancelled,
      color: isConfirmed ? "bg-green-500" : "bg-gray-600",
    },
    { label: "Attended", status: false, color: "bg-gray-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
    >
      {/* Image */}
      {booking.eventId && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={booking.eventId.imageUrl}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            alt={booking.eventId.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <StatusBadge status={booking.status} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {booking.eventId ? (
          <>
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
              {booking.eventId.name}
            </h3>

            {/* Timeline */}
            <div className="flex items-center gap-2 mb-4">
              {timelineSteps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${step.status ? step.color : "bg-gray-700"}`}
                    />
                    <span className="text-[10px] text-gray-500 mt-1">
                      {step.label}
                    </span>
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step.status ? "bg-gray-600" : "bg-gray-800"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Details */}
            <div className="text-sm text-gray-400 space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-purple-400" />
                {new Date(booking.eventId.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-400" />
                <span className="line-clamp-1">{booking.eventId.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTicketAlt className="text-green-400" />
                {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700">
                  {booking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                to={`/events/${booking.eventId._id}`}
                className="flex-1 flex items-center justify-center gap-2 text-sm bg-[#0f0f0f] text-white px-4 py-2 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors"
              >
                View Event <FaArrowRight className="text-xs" />
              </Link>

              {booking.status !== "cancelled" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCancel(booking._id)}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                >
                  <FaTimesCircle />
                </motion.button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <FaTimesCircle className="text-red-400" />
            </div>
            <p className="text-red-400 text-sm">Event no longer exists</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20"
  >
    <div className="relative inline-block mb-8">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center"
      >
        <FaCompass className="text-5xl text-purple-400" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
      >
        <span className="text-xs">✨</span>
      </motion.div>
    </div>

    <h3 className="text-2xl font-bold mb-3">No bookings yet</h3>
    <p className="text-gray-400 max-w-md mx-auto mb-8">
      Discover amazing events happening around you and book your spot today.
    </p>

    <Link to="/">
      <AnimatedButton variant="primary" size="lg">
        <FaCalendarAlt /> Explore Events
      </AnimatedButton>
    </Link>
  </motion.div>
);

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await api.delete(`/bookings/${id}`);
        toast.success("Booking cancelled successfully");
        fetchBookings();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to cancel booking");
      }
    }
  };

  if (loading) return <DashboardSkeleton />;

  const total = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  const upcomingBookings = bookings
    .filter((b) => b.eventId && new Date(b.eventId.date) > new Date())
    .sort((a, b) => new Date(a.eventId.date) - new Date(b.eventId.date));

  const pastBookings = bookings.filter(
    (b) => b.eventId && new Date(b.eventId.date) <= new Date()
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 md:px-16 py-10">
      <div className="max-w-7xl mx-auto">
        {/* USER HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-500/30"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </motion.div>

          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]}{" "}
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-gray-400">
              {upcomingBookings.length > 0
                ? `You have ${upcomingBookings.length} upcoming event${
                    upcomingBookings.length > 1 ? "s" : ""
                  }`
                : "Ready for your next adventure?"}
            </p>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatsCard
            title="Total Bookings"
            value={total}
            icon={FaTicketAlt}
            color="text-purple-400"
            delay={0}
          />
          <StatsCard
            title="Confirmed"
            value={confirmed}
            icon={FaCheckCircle}
            color="text-green-400"
            delay={0.1}
          />
          <StatsCard
            title="Pending"
            value={pending}
            icon={FaClock}
            color="text-yellow-400"
            delay={0.2}
          />
          <StatsCard
            title="Cancelled"
            value={cancelled}
            icon={FaTimesCircle}
            color="text-red-400"
            delay={0.3}
          />
        </div>

        {/* UPCOMING EVENTS */}
        {upcomingBookings.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaCalendarAlt className="text-purple-400" /> Upcoming Events
              </h2>
              <span className="text-sm text-gray-400">
                {upcomingBookings.length} event{upcomingBookings.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.map((booking, index) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={cancelBooking}
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* ALL BOOKINGS or EMPTY STATE */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaTicketAlt className="text-purple-400" /> Your Bookings
            </h2>
            {bookings.length > 0 && (
              <Link
                to="/"
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                Book More <FaArrowRight />
              </Link>
            )}
          </div>

          {bookings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking, index) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={cancelBooking}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* PAST EVENTS */}
        {pastBookings.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-400">
                Past Events
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
              {pastBookings.map((booking, index) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={cancelBooking}
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;