import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginButton from "./components/LoginButton";
import Hero from "./components/Hero";
// import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import AgentSection from "./components/AgentSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import TestApp from "./dashboard/App";
import WorkoutPage from "./onboarding/App";
import WorkoutSession from "./workout/App";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

// PageTransition component for consistent transitions
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    {...{ className: "relative z-10 min-h-screen w-full" }}
  >
    {children}
  </motion.div>
);

// Animated route transitions using framer-motion
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      {/* Global transition overlay that appears during page transitions */}
      <AnimatePresence>
        <motion.div
          key="global-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0.7 }}
          {...{ className: "fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 pointer-events-none" }}
          style={{ zIndex: 9999 }}
        />
      </AnimatePresence>

      {/* Actual route transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/onboarding" element={
            <PageTransition>
              <WorkoutPage />
            </PageTransition>
          } />
          <Route path="/dashboard" element={
            <PageTransition>
              <TestApp />
            </PageTransition>
          } />
          {/* Standard workout page */}
          <Route path="/workout" element={
            <PageTransition>
              <WorkoutSession />
            </PageTransition>
          } />
          {/* New route for shared workouts with ID */}
          <Route path="/workout/:workoutId" element={
            <PageTransition>
              <WorkoutSession />
            </PageTransition>
          } />
          <Route
            path="/"
            element={
              <PageTransition>
                <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 text-white">
                  <Header />
                  <Hero />
                  <HowItWorks />
                  <AgentSection />
                  <CTASection />
                  <Footer />
                </div>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

// Header component with user profile
function Header() {
  const { isAuthenticated } = useAuth0();

  return (
    <header className="glass-dark py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="font-montserrat text-2xl font-bold text-white flex items-center">
              <span className="text-indigo-400 mr-1">Fit</span>AI
            </Link>
          </motion.div>
        </div>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-blue-300 hover:text-white transition-colors font-medium">Dashboard</Link>
              <div className="flex items-center space-x-2">
                <LoginButton />
              </div>
            </>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LoginButton />
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  // Add this to ensure smooth scrolling behavior throughout the app
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
