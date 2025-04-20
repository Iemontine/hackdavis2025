import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-6">
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="font-bold text-xl">F</span>
        </div>
        <span className="font-bold text-xl">FitAI</span>
      </div>
      <div className="hidden md:flex space-x-8">
        <a href="#features" className="hover:text-blue-300 transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-blue-300 transition-colors">How It Works</a>
        <a href="#agents" className="hover:text-blue-300 transition-colors">Agents</a>
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors">
        Get Started
      </button>
    </nav>
  );
};

export default Navbar;