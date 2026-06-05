import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaFire,
  FaClock,
  FaHeart,
  FaShare,
} from "react-icons/fa";
import { EventCardSkeleton, HeroSkeleton } from "../components/SkeletonLoaders";
import {
  TrendingBadge,
  FreeBadge,
  AlmostFullBadge,
  CategoryBadge,
  FavoriteButton,
} from "../components/EventBadge";

const categories = ["All", "Comedy", "Music", "Business", "Technology", "Party"];

// Event Card Component
const EventCard = ({ event, isFavorite, onFavorite, index }) => {
  const isAlmostFull =
    event.availableSeats <= 20 && event.availableSeats > 0;
  const isFree = event.ticketPrice === 0;
  const isTrending =
    event.totalSeats - event.availableSeats > event.totalSeats * 0.7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={event.imageUrl}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          whileHover={{ scale: 1.1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />

        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={() => onFavorite(event._id)}
            size="sm"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isTrending && <TrendingBadge />}
          {isFree && <FreeBadge />}
          {isAlmostFull && <AlmostFullBadge seatsLeft={event.availableSeats} />}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <CategoryBadge category={event.category} />
        </div>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(
              `${window.location.origin}/events/${event._id}`
            );
            toast.success("Link copied to clipboard!");
          }}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <FaShare className="text-sm" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-purple-400 transition-colors">
          {event.name}
        </h3>

        <div className="text-sm text-gray-400 mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-purple-400" />
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-pink-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold ${
                isFree ? "text-green-400" : "text-purple-400"
              }`}
            >
              {isFree ? "FREE" : `₹${event.ticketPrice}`}
            </span>
            {isAlmostFull && (
              <span className="text-xs text-orange-400">
                {event.availableSeats} left
              </span>
            )}
          </div>

          <Link
            to={`/events/${event._id}`}
            className="group/btn flex items-center gap-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            View
            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Hero Section Component - Full Height with Featured Event
const HeroSection = ({ featuredEvent, user, search, setSearch, activeCategory, setActiveCategory }) => {
  if (!featuredEvent) return <HeroSkeleton />;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Greeting */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {user ? (
              <>
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  {user.name.split(" ")[0]}
                </span>
              </>
            ) : (
              <>
                Discover Amazing{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  Events
                </span>
              </>
            )}
          </h1>

          <p className="text-gray-400 text-lg max-w-md mb-8">
            Standup, concerts, tech meetups, parties — find your next unforgettable experience.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#1a1a1a] border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Right - Featured Event Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to={`/events/${featuredEvent._id}`}>
            <motion.div
              whileHover={{ y: -8 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

              <img
                src={featuredEvent.imageUrl}
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                alt={featuredEvent.name}
              />

              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <FaFire /> Featured
                  </span>
                  <CategoryBadge category={featuredEvent.category} />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {featuredEvent.name}
                </h2>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {featuredEvent.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-purple-400" />
                    {new Date(featuredEvent.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-pink-400" />
                    {featuredEvent.location}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, icon: Icon, viewAllLink }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="text-purple-400 text-xl" />}
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {viewAllLink && (
      <Link
        to={viewAllLink}
        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
      >
        View All <FaArrowRight />
      </Link>
    )}
  </div>
);

const Home = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("enkai_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("enkai_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEvents();
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, activeCategory]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(`/events?search=${search}`);
      let filtered = data;

      if (activeCategory !== "All") {
        filtered = filtered.filter((e) => e.category === activeCategory);
      }

      setEvents(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (eventId) => {
    const isFav = favorites.includes(eventId);
    if (isFav) {
      setFavorites((prev) => prev.filter((id) => id !== eventId));
      toast.success("Removed from favorites");
    } else {
      setFavorites((prev) => [...prev, eventId]);
      toast.success("Added to favorites");
    }
  };

  // Filter events for different sections
  const trendingEvents = events.filter(
    (e) => e.totalSeats - e.availableSeats > e.totalSeats * 0.6
  );
  const upcomingEvents = events
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);
  const featuredEvent = events[0];

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      {/* Full Height Hero Section */}
      <div className="px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <HeroSection
            featuredEvent={featuredEvent}
            user={user}
            search={search}
            setSearch={setSearch}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>

      {/* Events Grid Section */}
      <div className="px-6 md:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Category Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold">
              {activeCategory === "All" ? "All Events" : `${activeCategory} Events`}
            </h2>

            {/* All Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaSearch className="text-4xl text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your search</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isFavorite={favorites.includes(event._id)}
                  onFavorite={toggleFavorite}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;