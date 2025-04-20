import { useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProfileCard from './ProfileCard';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();

  // References for smooth scrolling
  const dashboardRef = useRef(null);
  const featuresRef = useRef(null);
  const agentsRef = useRef(null);

  // Create a user profile object directly from Auth0 data
  const user = {
    name: auth0User?.name || "Anonymous User",
    email: auth0User?.email || "",
    auth0_id: auth0User?.sub || "",
    experience: "Not specified",
    goal: "Not specified",
    height: "Not specified",
    weight: "Not specified",
    age: 0,
    workout_time: "Not specified",
    fitness_level: "Not specified",
    lastWorkout: "None yet", // You might want to add these fields to your backend
    lastWorkoutDate: "N/A"
  };

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
            <div className="flex items-center">
              {auth0User?.picture ? (
                <div className="relative">
                  <img
                    src={auth0User.picture}
                    alt={auth0User.name || "User"}
                    className="w-8 h-8 rounded-full border-2 border-indigo-400/50"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-semibold">
                  {auth0User?.name?.charAt(0) || "?"}
                </div>
              )}
              <span className="ml-2 hidden md:inline">{auth0User?.name || "User"}</span>
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
            <ProfileCard user={user} isLoading={isLoading} />

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