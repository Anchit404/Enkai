import { motion } from "framer-motion";
import { FaChair } from "react-icons/fa";

const SeatAvailabilityBar = ({ available, total }) => {
  const percentage = Math.round((available / total) * 100);
  const isAlmostFull = percentage <= 20 && available > 0;
  const isSoldOut = available <= 0;

  const getColor = () => {
    if (isSoldOut) return "from-gray-600 to-gray-700";
    if (isAlmostFull) return "from-yellow-500 to-orange-500";
    if (percentage <= 50) return "from-blue-500 to-purple-500";
    return "from-green-500 to-emerald-500";
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-300">
          <FaChair className="text-purple-400" />
          <span className="text-sm font-medium">Seat Availability</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{available}</span>
          <span className="text-gray-500 text-sm"> / {total}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
        />
      </div>

      {/* Status Text */}
      <div className="mt-2 text-xs">
        {isSoldOut ? (
          <span className="text-red-400 font-medium">Sold Out</span>
        ) : isAlmostFull ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-orange-400 font-medium"
          >
            Hurry! Only {available} seats left
          </motion.span>
        ) : percentage <= 50 ? (
          <span className="text-blue-400">Filling fast - {percentage}% available</span>
        ) : (
          <span className="text-green-400">Good availability - {percentage}% seats left</span>
        )}
      </div>
    </div>
  );
};

export default SeatAvailabilityBar;
