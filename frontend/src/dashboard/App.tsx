// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileCard from "./ProfileCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

// Stagger animation for children elements
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Define interface for MongoDB user data
interface UserProfileData {
  id: string;
  auth0_id: string;
  name: string;
  email: string;
  preferences: Record<string, string | number | boolean>;
  created_at: string;
  height?: string;
  weight?: string;
  age?: number;
  fitness_level?: string;
  workout_time?: string;
  goal?: string;
}

function App() {
  const { user: auth0User, isLoading } = useAuth0();
  const [workoutData, setWorkoutData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Workout Duration (minutes)",
        data: [30, 45, 0, 60, 0, 0, 0],
        borderColor: "#818cf8", // Lighter indigo for dark theme
        backgroundColor: "rgba(129, 140, 248, 0.2)", // Semi-transparent indigo
        tension: 0.3,
        fill: true,
      },
    ],
  });

  // Add state for MongoDB user data
  const [mongoDbUser, setMongoDbUser] = useState<UserProfileData | null>(null);
  // const [isLoadingDbData, setIsLoadingDbData] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // References for smooth scrolling
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  // Fetch user data from MongoDB
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth0User?.sub) return;

      try {
        setIsLoadingDbData(true);
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/users/${auth0User.sub}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.status}`);
        }

        const userData = await response.json();
        console.log("User data from MongoDB:", userData);
        setMongoDbUser(userData);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoadingDbData(false);
      }
    };

    if (auth0User?.sub) {
      fetchUserData();
    }
  }, [auth0User]);

  // Create a user profile object with MongoDB data, falling back to Auth0 data
  const user = {
    name: mongoDbUser?.name || auth0User?.name || "Anonymous User",
    email: mongoDbUser?.email || auth0User?.email || "",
    auth0_id: mongoDbUser?.auth0_id || auth0User?.sub || "",
    picture: auth0User?.picture || "", // Auth0 picture as MongoDB doesn't store it
    goal: mongoDbUser?.goal || "Build muscle",
    height: mongoDbUser?.height || "5'10\"",
    weight: mongoDbUser?.weight || "175 lbs",
    age: mongoDbUser?.age || 28,
    workout_time: mongoDbUser?.workout_time || "45 minutes",
    fitness_level: mongoDbUser?.fitness_level || "Intermediate",
    lastWorkout: "Upper Body", // These aren't in MongoDB yet
    lastWorkoutDate: "Yesterday",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
      {/* Navigation Bar */}
      <nav className="glass-dark sticky top-0 z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="font-montserrat text-2xl font-bold flex items-baseline"
            >
              <span className="text-indigo-400 mr-1">Fit</span>
              <span className="text-white">AI</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {auth0User?.picture ? (
                <div className="relative">
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <img
                      src={auth0User.picture}
                      alt={auth0User.name || "User"}
                      className="w-10 h-10 rounded-full border-2 border-indigo-400 object-cover"
                    />
                  </motion.div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-slate-800"></div>
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-500/30 flex items-center justify-center text-white font-semibold">
                  {auth0User?.name?.charAt(0) || "?"}
                </div>
              )}
              <span className="ml-3 hidden md:inline font-medium text-white/90">
                {auth0User?.name || "User"}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Section */}
        <motion.section
          ref={dashboardRef}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="py-8">
            <motion.div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }}
              variants={containerVariants}
            >
              {/* User Profile Card */}
              <motion.div variants={itemVariants}>
                <ProfileCard user={user} isLoading={isLoading} />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                {...{ className: "glass rounded-2xl border border-white/20 p-6 transform hover:border-indigo-500/30" }}
                variants={itemVariants}
              >
                <h2 className="text-xl font-semibold text-white mb-4 font-montserrat">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/workout"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
                  >
                    <svg
                      className="w-6 h-6 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="font-medium">Start Workout</span>
                  </Link>
                  <Link
                    to="/onboarding"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
                  >
                    <svg
                      className="w-6 h-6 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      ></path>
                    </svg>
                    <span className="font-medium">Plan Workout</span>
                  </Link>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
                    <svg
                      className="w-6 h-6 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                    <span className="font-medium">Progress</span>
                  </button>
                  <button className="bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-xl flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
                    <svg
                      className="w-6 h-6 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span className="font-medium">Schedule</span>
                  </button>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                {...{ className: "glass rounded-2xl border border-white/20 p-6 transform hover:border-indigo-500/30" }}
                variants={itemVariants}
              >
                <h2 className="text-xl font-semibold text-white mb-4 font-montserrat">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-900/30 rounded-r-lg">
                    <p className="font-medium text-white/90">
                      Completed {user.lastWorkout} workout
                    </p>
                    <p className="text-sm text-white/60">
                      {user.lastWorkoutDate}
                    </p>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-900/30 rounded-r-lg">
                    <p className="font-medium text-white/90">
                      Updated fitness goals
                    </p>
                    <p className="text-sm text-white/60">1 week ago</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/30 rounded-r-lg">
                    <p className="font-medium text-white/90">
                      Added new personal record
                    </p>
                    <p className="text-sm text-white/60">1 week ago</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full py-2 border border-white/30 text-white/90 rounded-lg hover:bg-white/10 transition-colors">
                    View All Activity
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Weekly Overview and Fitness Analytics */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Progress */}
              <motion.div
                {...{ className: "glass rounded-2xl border border-white/20 p-6" }}
                variants={itemVariants}
              >
                <h2 className="text-xl font-semibold text-white mb-4 font-montserrat">
                  Weekly Progress
                </h2>
                <div className="h-64 bg-slate-900/50 p-4 rounded-xl">
                  <Line
                    data={workoutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top",
                          labels: {
                            color: "rgba(255, 255, 255, 0.8)",
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                          ticks: {
                            color: "rgba(255, 255, 255, 0.7)",
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            color: "rgba(255, 255, 255, 0.7)",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="mt-4 flex justify-between text-sm text-white/70">
                  <span>2 Workouts Completed</span>
                  <span>Goal: 4 Workouts/week</span>
                </div>
              </motion.div>

              {/* Weekly Schedule */}
              <motion.div
                {...{ className: "glass rounded-2xl border border-white/20 p-6" }}
                variants={itemVariants}
              >
                <h2 className="text-xl font-semibold text-white mb-4 font-montserrat">
                  Weekly Schedule
                </h2>
                <div className="grid grid-cols-7 gap-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                      <motion.div
                        key={day}
                        {...{
                          className: `p-4 rounded-xl border ${index === 1
                              ? "bg-indigo-900/50 border-indigo-500/50"
                              : index === 2
                                ? "bg-violet-900/50 border-violet-500/50"
                                : "bg-slate-800/50 border-slate-700/50"
                            }`
                        }}
                        whileHover={{
                          y: -5,
                          boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
                        }}
                      >
                        <p className="text-center font-medium text-white/90">
                          {day}
                        </p>
                        <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              index === 1
                                ? "bg-indigo-500"
                                : index === 2
                                ? "bg-violet-500"
                                : index < 1
                                ? "bg-emerald-500"
                                : "bg-slate-700"
                            }`}
                            style={{
                              width:
                                index < 2 ? "100%" : index === 2 ? "60%" : "0%",
                            }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-center text-white/80">
                          {index === 1
                            ? "Upper Body"
                            : index === 2
                            ? "Cardio"
                            : index === 4
                            ? "Legs"
                            : ""}
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-emerald-400 font-medium">
                    2 Completed
                  </span>
                  <span className="text-violet-400 font-medium">
                    1 In Progress
                  </span>
                  <span className="text-gray-400 font-medium">4 Upcoming</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-indigo-900 border-t border-white/10 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link
              to="/"
              className="text-xl font-bold font-montserrat flex items-center justify-center inline-block"
            >
              <span className="text-indigo-400 mr-1">Fit</span>AI
            </Link>
            <p className="mt-2 text-blue-100">
              Your AI-powered fitness companion
            </p>
            <p className="mt-6 text-gray-400">
              © 2023 FitAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
