import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Navigation */}
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
          <a href="#testimonials" className="hover:text-blue-300 transition-colors">Testimonials</a>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
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

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">AI-Powered Fitness Experience</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all">
              <div className="rounded-full bg-blue-500 w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Custom AI Workouts</h3>
              <p className="text-blue-100">
                Our AI creates personalized workout plans tailored to your goals, available equipment, and fitness level.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all">
              <div className="rounded-full bg-blue-500 w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time AI Coaching</h3>
              <p className="text-blue-100">
                Let our AI coach guide you with timers and voice commands. Just say "Done with my set" to move to the next exercise.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all">
              <div className="rounded-full bg-blue-500 w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Progress Tracking</h3>
              <p className="text-blue-100">
                Track your improvements over time with AI-driven insights that adapt your workouts as you progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">What Our Users Are Saying</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center mb-4 gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                <div>
                  <h4 className="font-bold">Alex T.</h4>
                  <p className="text-sm text-blue-300">Fitness Beginner</p>
                </div>
              </div>
              <p className="text-blue-100">
                "As someone new to working out, having an AI coach guide me through each exercise has been incredible. I never feel lost anymore!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center mb-4 gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div>
                  <h4 className="font-bold">Jamie K.</h4>
                  <p className="text-sm text-blue-300">Busy Professional</p>
                </div>
              </div>
              <p className="text-blue-100">
                "The voice-controlled workouts are game-changing. I can focus on my form while the AI handles timing and progression."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
              <div className="flex items-center mb-4 gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-teal-400"></div>
                <div>
                  <h4 className="font-bold">Morgan P.</h4>
                  <p className="text-sm text-blue-300">Advanced Athlete</p>
                </div>
              </div>
              <p className="text-blue-100">
                "Even as an experienced lifter, the AI constantly challenges me with new routines that keep pushing my limits."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to transform your fitness journey?</h2>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Join thousands who are already using AI to reach their fitness goals faster and more effectively.
          </p>
          <button className="bg-white text-blue-900 hover:bg-blue-50 px-10 py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105">
            Start Your Free Trial
          </button>
          <p className="mt-4 text-blue-200">No credit card required</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-xl">FitAI</span>
            </div>
            <p className="text-blue-300 text-sm">Your AI-powered fitness partner</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4 text-center md:text-left">
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Features</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Support</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Blog</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">About Us</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Contact</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">© 2023 FitAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App
