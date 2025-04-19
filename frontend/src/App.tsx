import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import LoginButton from "./components/LoginButton";
import TestApp from './test/App';

function App() {
  const [showMore, setShowMore] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/test" element={<TestApp />} />
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white">
            <Navbar />
            <Hero />
            <FeaturesSection />
            <HowItWorks />
            <TestimonialsSection />
            <CTASection />
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
