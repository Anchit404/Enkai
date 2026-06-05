import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserDashboard from "./pages/UserDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import EventDetail from "./pages/EventDetail"

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
}

const pageTransition = {
  duration: 0.2,
}

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="min-h-screen bg-[#0f0f0f] w-full"
    style={{ willChange: "opacity" }}
  >
    {children}
  </motion.div>
)

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <Home />
            </AnimatedPage>
          }
        />
        <Route
          path="/login"
          element={
            <AnimatedPage>
              <Login />
            </AnimatedPage>
          }
        />
        <Route
          path="/register"
          element={
            <AnimatedPage>
              <Register />
            </AnimatedPage>
          }
        />
        <Route
          path="/events/:id"
          element={
            <AnimatedPage>
              <EventDetail />
            </AnimatedPage>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AnimatedPage>
              <UserDashboard />
            </AnimatedPage>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AnimatedPage>
              <AdminDashboard />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
