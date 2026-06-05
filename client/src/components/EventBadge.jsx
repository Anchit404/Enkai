import { motion } from "framer-motion";
import { FaFire, FaGift, FaClock, FaHeart } from "react-icons/fa";

export const TrendingBadge = () => (
  <motion.span
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-orange-500/30"
  >
    <FaFire className="text-sm" />
    Trending
  </motion.span>
);

export const FreeBadge = () => (
  <motion.span
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-green-500/30"
  >
    <FaGift className="text-sm" />
    Free Entry
  </motion.span>
);

export const AlmostFullBadge = ({ seatsLeft }) => (
  <motion.span
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-yellow-500/30"
  >
    <FaClock className="text-sm" />
    Only {seatsLeft} left
  </motion.span>
);

export const CategoryBadge = ({ category }) => {
  const colors = {
    Comedy: "from-pink-500 to-rose-500",
    Music: "from-purple-500 to-violet-500",
    Business: "from-blue-500 to-cyan-500",
    Technology: "from-indigo-500 to-purple-500",
    Party: "from-fuchsia-500 to-pink-500",
    default: "from-gray-500 to-gray-600",
  };

  const gradient = colors[category] || colors.default;

  return (
    <span
      className={`px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-medium rounded-full`}
    >
      {category}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.pending}`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </motion.span>
  );
};

export const FavoriteButton = ({ isFavorite, onClick, size = "md" }) => {
  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`${sizeClasses} rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/70`}
    >
      <motion.div
        animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <FaHeart
          className={`${iconSize} transition-colors ${
            isFavorite ? "text-red-500 fill-red-500" : "text-white"
          }`}
        />
      </motion.div>
    </motion.button>
  );
};
