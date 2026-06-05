import { motion } from "framer-motion";

export const AnimatedButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  type = "button",
}) => {
  const baseStyles =
    "relative font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]",
    secondary:
      "bg-[#1a1a1a] border border-gray-700 text-white hover:border-purple-500 hover:bg-[#222]",
    outline:
      "bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/30",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none"
    : "";

  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export const IconButton = ({
  children,
  onClick,
  className = "",
  size = "md",
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`${sizes[size]} rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 transition-colors ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
