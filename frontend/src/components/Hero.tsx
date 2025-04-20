import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

function Hero() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-20"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-[15%] w-80 h-80 bg-purple-600 rounded-full mix-blend-soft-light filter blur-[120px] opacity-20"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
      <div className="container max-w-6xl px-4 py-24 mx-auto sm:py-32 lg:py-50">
        <div className="grid items-center grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 justify-items-center">
          {/* Left column with text */}
          <div className="lg:max-w-xl lg:pr-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-montserrat">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI-Powered</span> Fitness Coach
              </h1>

              <p className="max-w-2xl mb-8 text-xl text-purple-100 sm:text-2xl">
                Get personalized workout plans, progress tracking, and real-time guidance with our AI fitness assistant.
              </p>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/onboarding"}
                  className="px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-lg hover:shadow-purple-500/25 transition duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="#how-it-works"
                  className="px-8 py-3 text-lg font-medium text-indigo-100 bg-purple-800/30 border border-purple-400/30 rounded-lg hover:bg-purple-700/40 transition duration-300"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right column with image/illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex justify-center lg:justify-start lg:pl-4"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-normal filter blur-2xl opacity-20"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-normal filter blur-2xl opacity-20"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-normal filter blur-2xl opacity-20"></div>

              <div className="relative glass backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <img
                  src="/image.png"
                  alt="FitAI Dashboard Preview"
                  className="w-full rounded-lg min-h-[300px] bg-gray-800"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = "https://via.placeholder.com/600x400?text=FitAI+Dashboard";
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;