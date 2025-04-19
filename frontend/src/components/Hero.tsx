import React from 'react';

const Hero: React.FC = () => {
  return (
    <header className="relative px-6 py-20 md:py-32 flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-blue-500/20 to-transparent opacity-70 z-0"></div>
      <div className="max-w-4xl text-center z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Your Personal <span className="text-blue-400">AI</span> Fitness Coach
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
          The complete AI-powered experience to plan, track, and guide your workouts - whether you're just starting or taking your fitness to the next level.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105">
            Start Your Journey
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-lg transition-all">
            Watch Demo
          </button>
        </div>
        
        {/* Mockup Image */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 rounded-full"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-3xl shadow-2xl max-w-3xl mx-auto">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-blue-200 font-medium">Interactive Demo: AI-Guided Workout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;