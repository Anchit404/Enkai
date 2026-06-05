import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaTicketAlt,
  FaCalendarPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaClock,
  FaEye,
  FaSave,
  FaArrowRight,
  FaCog,
} from "react-icons/fa";
import { AnimatedButton } from "../components/AnimatedButton";
import { AdminDashboardSkeleton } from "../components/SkeletonLoaders";
import { StatusBadge, CategoryBadge } from "../components/EventBadge";

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
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
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color
          .replace("text-", "from-")
          .replace("-400", "-500/20")} ${color
          .replace("text-", "to-")
          .replace("-400", "-500/10")} flex items-center justify-center`}
      >
        <Icon className={`text-xl ${color}`} />
      </div>
    </div>
  </motion.div>
);

// Event Preview Card
const EventPreviewCard = ({ formData }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden sticky top-24"
  >
    <div className="p-4 border-b border-gray-800">
      <h3 className="font-semibold flex items-center gap-2">
        <FaEye className="text-purple-400" /> Live Preview
      </h3>
    </div>

    <div className="p-4">
      {/* Image Preview */}
      <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-gray-800">
        {formData.imageUrl ? (
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <span className="text-sm">Event Image Preview</span>
          </div>
        )}
        {formData.category && (
          <div className="absolute top-3 left-3">
            <CategoryBadge category={formData.category} />
          </div>
        )}
      </div>

      {/* Event Info Preview */}
      <h4 className="font-semibold text-lg mb-2 line-clamp-1">
        {formData.name || "Event Title"}
      </h4>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {formData.description || "Event description will appear here..."}
      </p>

      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <FaCalendarPlus className="text-purple-400" />
          <span>
            {formData.date
              ? new Date(formData.date).toLocaleDateString()
              : "Event Date"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaUsers className="text-pink-400" />
          <span>{formData.location || "Location"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaTicketAlt className="text-green-400" />
          <span>
            {formData.totalSeats ? `${formData.totalSeats} seats` : "Seats"} •{" "}
            {formData.ticketPrice === "0" || formData.ticketPrice === ""
              ? "Free"
              : `₹${formData.ticketPrice}`}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [showEventForm, setShowEventForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate, authLoading]);

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/all"),
      ]);

      setEvents(eventsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError(
        "Failed to load data: " +
          (error.response?.data?.message || error.message)
      );
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = { ...formData, name: formData.name };
      await api.post("/events", eventData);
      toast.success("Event created successfully!");
      setShowEventForm(false);
      setFormStep(1);
      setFormData({
        name: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        imageUrl: "",
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Delete this event? This action cannot be undone.")) {
      try {
        await api.delete(`/events/${id}`);
        toast.success("Event deleted successfully");
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting event");
      }
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      toast.success(
        `Booking ${paymentStatus === "paid" ? "approved with payment" : "approved"}`
      );
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await api.delete(`/bookings/${id}`);
        toast.success("Booking cancelled");
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error canceling booking");
      }
    }
  };

  // Calculate stats
  const totalRevenue = bookings.reduce(
    (sum, b) =>
      b.paymentStatus === "paid" && b.status === "confirmed" ? sum + b.amount : sum,
    0
  );
  const paidUsers = new Set(
    bookings
      .filter((b) => b.paymentStatus === "paid" && b.status === "confirmed")
      .map((b) => b.userId?._id)
  ).size;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;

  if (authLoading || loading) return <AdminDashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white px-6 md:px-12 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FaTimes className="text-4xl text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-400">{error}</p>
          <AnimatedButton onClick={fetchData} variant="primary" className="mt-6">
            Retry
          </AnimatedButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 md:px-12 py-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FaCog className="text-white" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage events, bookings & platform analytics
          </p>
        </div>

        <AnimatedButton
          onClick={() => {
            setShowEventForm(!showEventForm);
            setFormStep(1);
          }}
          variant="primary"
          size="md"
        >
          <FaCalendarPlus />{" "}
          {showEventForm ? "Close Form" : "Create Event"}
        </AnimatedButton>
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={FaMoneyBillWave}
          color="text-green-400"
          subtitle={`${confirmedBookings} paid bookings`}
          delay={0}
        />
        <StatsCard
          title="Paid Users"
          value={paidUsers}
          icon={FaUsers}
          color="text-blue-400"
          subtitle="Unique customers"
          delay={0.1}
        />
        <StatsCard
          title="Pending"
          value={pendingBookings}
          icon={FaClock}
          color="text-yellow-400"
          subtitle="Awaiting approval"
          delay={0.2}
        />
        <StatsCard
          title="Total Events"
          value={events.length}
          icon={FaTicketAlt}
          color="text-purple-400"
          subtitle="Active events"
          delay={0.3}
        />
      </div>

      {/* CREATE EVENT FORM */}
      <AnimatePresence>
        {showEventForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="lg:col-span-2 bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Create New Event</h2>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          formStep >= step
                            ? "bg-purple-500 text-white"
                            : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCreateEvent}>
                  {/* Step 1: Basic Info */}
                  {formStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                          Event Title
                        </label>
                        <input
                          placeholder="Enter event title"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">
                            Category
                          </label>
                          <select
                            required
                            className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category: e.target.value,
                              })
                            }
                          >
                            <option value="">Select category</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Music">Music</option>
                            <option value="Business">Business</option>
                            <option value="Technology">Technology</option>
                            <option value="Party">Party</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">
                            Date
                          </label>
                          <input
                            type="date"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            value={formData.date}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <AnimatedButton
                          type="button"
                          onClick={() => setFormStep(2)}
                          variant="primary"
                        >
                          Next <FaArrowRight />
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Details */}
                  {formStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                          Location
                        </label>
                        <input
                          placeholder="Enter venue/location"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">
                            Total Seats
                          </label>
                          <input
                            type="number"
                            placeholder="Number of seats"
                            required
                            min="1"
                            className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            value={formData.totalSeats}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                totalSeats: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">
                            Ticket Price (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="0 for free events"
                            required
                            min="0"
                            className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            value={formData.ticketPrice}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ticketPrice: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <AnimatedButton
                          type="button"
                          onClick={() => setFormStep(1)}
                          variant="secondary"
                        >
                          Back
                        </AnimatedButton>
                        <AnimatedButton
                          type="button"
                          onClick={() => setFormStep(3)}
                          variant="primary"
                        >
                          Next <FaArrowRight />
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Media & Description */}
                  {formStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                          Image URL
                        </label>
                        <input
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                          value={formData.imageUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              imageUrl: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                          Description
                        </label>
                        <textarea
                          placeholder="Describe your event..."
                          required
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex justify-between">
                        <AnimatedButton
                          type="button"
                          onClick={() => setFormStep(2)}
                          variant="secondary"
                        >
                          Back
                        </AnimatedButton>
                        <AnimatedButton type="submit" variant="primary">
                          <FaSave /> Publish Event
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Live Preview */}
              <EventPreviewCard formData={formData} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b border-gray-800">
        {["overview", "events", "bookings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {/* EVENTS TAB */}
        {(activeTab === "overview" || activeTab === "events") && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Events</h2>
              <span className="text-sm text-gray-400">
                {events.length} total
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.length === 0 ? (
                <p className="text-gray-500 text-center py-8 col-span-full">
                  No events found. Create one!
                </p>
              ) : (
                events.map((e, index) => (
                  <motion.div
                    key={e._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={e.imageUrl}
                        alt={e.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{e.name}</h3>
                        <p className="text-sm text-gray-400">
                          {e.availableSeats}/{e.totalSeats} seats available
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <CategoryBadge category={e.category} />
                          <span className="text-xs text-gray-500">
                            {new Date(e.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteEvent(e._id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm"
                      >
                        <FaTrash /> Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* BOOKINGS TAB */}
        {(activeTab === "overview" || activeTab === "bookings") && (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Bookings</h2>
              <span className="text-sm text-gray-400">
                {bookings.length} total
              </span>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No bookings yet.
                </p>
              ) : (
                bookings.map((b, index) => (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <FaTicketAlt className="text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {b.eventId?.name || (
                              <span className="text-red-400">Deleted Event</span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {b.userId?.name} • ₹{b.amount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={b.status} />
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            b.paymentStatus === "paid"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {b.status === "pending" && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleConfirmBooking(b._id, "paid")}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors text-sm"
                        >
                          <FaCheck /> Approve Paid
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleConfirmBooking(b._id, "not_paid")}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-sm"
                        >
                          <FaCheck /> Approve
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCancelBooking(b._id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm"
                        >
                          <FaTimes /> Reject
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;