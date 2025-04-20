import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginButton from "./components/LoginButton";
import Hero from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import AgentSection from "./components/AgentSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import TestApp from "./dashboard/App";
import WorkoutPage from "./workout/App";
import WorkoutSession from "./workoutsession/App";

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
              <Navbar />
              <LoginButton />
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
