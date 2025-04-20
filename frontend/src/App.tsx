import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginButton from "./components/LoginButton";
import Hero from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import AgentSection from "./components/AgentSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import TestApp from "./dashboard/App";
import WorkoutPage from "./onboarding/App";
import WorkoutSession from "./workout/App";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

// Header component with user profile
function Header() {
  const { isAuthenticated } = useAuth0();
  
  return (
    <header className="bg-black/20 backdrop-blur-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-white">Your App Name</div>
        
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-blue-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/workout" className="text-blue-300 hover:text-white transition-colors">Workout</Link>
              <div className="flex items-center">
                <LoginButton />
              </div>
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/dashboard" element={<TestApp />} />
        <Route path="/workoutsession" element={<WorkoutSession />} />
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white">
              <Header />
              <Hero />
              <FeaturesSection />
              <HowItWorks />
              <AgentSection />
              <CTASection />
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
