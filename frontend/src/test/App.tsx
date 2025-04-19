import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState({
    name: "Alex Johnson",
    experience: "Intermediate",
    goal: "Strength",
    height: "5'10\"",
    weight: "175 lbs",
    lastWorkout: "Upper Body",
    lastWorkoutDate: "Yesterday"
  });

  // References for smooth scrolling
  const dashboardRef = useRef(null);
  const featuresRef = useRef(null);
  const agentsRef = useRef(null);

  // Scroll to section function
  const scrollToSection = (section) => {
    setActiveSection(section);
    if (section === 'dashboard') dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'features') featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'agents') agentsRef.current?.scrollIntoView({ behavior: 'smooth' });  
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">FitAI</h1>
          </div>
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('dashboard')} 
              className={`${activeSection === 'dashboard' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-500 transition-colors`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className={`${activeSection === 'features' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-500 transition-colors`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('agents')} 
              className={`${activeSection === 'agents' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-500 transition-colors`}
            >
              AI Agents
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                <span className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-semibold">
                  {user.name.charAt(0)}
                </span>
                <span className="ml-2 hidden md:inline">{user.name}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Section */}
        <section ref={dashboardRef} className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-gray-500">{user.experience} • {user.goal}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{user.height}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{user.weight}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
                  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Start Workout</span>
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
                  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span>Plan Workout</span>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
                  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span>Progress</span>
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
                  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>Schedule</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <p className="font-medium">Completed {user.lastWorkout} workout</p>
                  <p className="text-sm text-gray-500">{user.lastWorkoutDate}</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <p className="font-medium">Updated fitness goals</p>
                  <p className="text-sm text-gray-500">1 week ago</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="font-medium">Added new personal record</p>
                  <p className="text-sm text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  View All Activity
                </button>
              </div>
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Overview</h2>
            <div className="grid grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className={`p-4 rounded-lg ${index === 1 ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-gray-50'}`}>
                  <p className="text-center font-medium">{day}</p>
                  <div className={`mt-2 h-2 rounded-full ${index === 1 ? 'bg-indigo-500' : index < 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>2 Completed</span>
              <span>5 Remaining</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Workouts</h3>
              <p className="text-gray-600">
                AI-powered workouts designed specifically for your goals, equipment, and experience level.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-Time Guidance</h3>
              <p className="text-gray-600">
                Get guidance through each exercise with voice commands and real-time feedback.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track your progress over time with detailed metrics and insights about your performance.
              </p>
            </div>
          </div>
        </section>

        {/* AI Agents Section */}
        <section ref={agentsRef} className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Meet Your AI Agents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform transition duration-500 hover:scale-105">
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Planner</h3>
              <p className="text-white/90 text-center">
                Gets to know you personally by learning your goals, fitness level, equipment access, and preferences to create a personalized fitness journey.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-6 rounded-xl shadow-lg text-white transform transition duration-500 hover:scale-105">
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Workout Planner</h3>
              <p className="text-white/90 text-center">
                Creates customized workout plans based on your profile data, adjusting exercises for your available equipment, experience level, and specific fitness goals.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white transform transition duration-500 hover:scale-105">
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Workout Coach</h3>
              <p className="text-white/90 text-center">
                Guides you through each exercise in real-time, managing timers, counting reps, and providing form tips. Responds to voice commands like "Done with my set" for a hands-free experience.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold">FitAI</h3>
            <p className="mt-2">Your AI-powered fitness companion</p>
            <p className="mt-6 text-gray-400">© 2023 FitAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
