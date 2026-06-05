import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <FaClock />
        <span className="text-sm font-medium">Event has ended</span>
      </div>
    );
  }

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-b from-purple-500 to-pink-500 text-white font-bold text-lg md:text-xl w-12 md:w-14 h-12 md:h-14 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3 text-gray-400">
        <FaClock className="text-purple-400" />
        <span className="text-sm font-medium">Event starts in</span>
      </div>
      <div className="flex gap-2 md:gap-3">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

export default CountdownTimer;
