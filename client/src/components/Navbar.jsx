import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { FaHome, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link to={to}>
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
          isActive(to)
            ? "text-white bg-white/10"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        {Icon && <Icon className="text-sm" />}
        {children}
      </motion.span>
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full px-6 md:px-16 py-4 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-gray-800 shadow-lg shadow-black/20"
          : "bg-[#0f0f0f]/80 backdrop-blur-lg border-b border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link to="/">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text"
          >
            ENKAI
          </motion.span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <NavLink to="/" icon={FaHome}>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink
                to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                icon={FaUser}
              >
                Dashboard
              </NavLink>

              {/* User Badge */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-gray-700"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm">
                    {user.name?.split(" ")[0]}
                  </span>
                </motion.div>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition-colors"
                >
                  <FaSignOutAlt />
                  Logout
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-700">
              <NavLink to="/login" icon={FaSignInAlt}>
                Login
              </NavLink>

              <Link to="/register">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  <FaUserPlus />
                  Sign Up
                </motion.span>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-[#1a1a1a] border border-gray-700 text-white"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </motion.button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4"
          >
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  isActive("/")
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FaHome /> Home
              </Link>

              {user ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive("/dashboard") || isActive("/admin-dashboard")
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <FaUser /> Dashboard
                  </Link>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-medium"
                  >
                    <FaSignOutAlt /> Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive("/login")
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <FaSignInAlt /> Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                  >
                    <FaUserPlus /> Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;