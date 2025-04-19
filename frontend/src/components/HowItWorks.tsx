import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">How It Works</h2>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="space-y-12">
              <div className="flex gap-4 items-start">
                <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Tell us your goals</h3>
                  <p className="text-blue-100">Share your fitness objectives, available equipment, and preferences with our AI.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Get your AI workout plan</h3>
                  <p className="text-blue-100">Our AI creates a personalized routine optimized for your specific goals and situation.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Train with AI guidance</h3>
                  <p className="text-blue-100">Your AI coach guides you through each workout, adjusting in real-time to your voice commands.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-900 to-indigo-800 rounded-xl p-8 border border-blue-700/50">
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <span className="font-bold">AI</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">FitAI Coach</h4>
                    <p className="text-xs text-blue-300">Personal Workout Assistant</p>
                  </div>
                </div>
                <p className="text-blue-100 mb-3">Ready for your chest workout today? I've prepared 4 exercises based on your goals.</p>
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-sm font-medium text-blue-200 mb-1">Bench Press</p>
                  <p className="text-xs text-blue-300">3 sets × 8-10 reps | 60-90 sec rest</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 max-w-xs">
                  <p className="text-blue-100 mb-2">Done with my set!</p>
                  <div className="bg-blue-500 rounded p-2 text-sm">
                    <p className="font-medium">Great job! Timer started for 90 seconds rest.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;