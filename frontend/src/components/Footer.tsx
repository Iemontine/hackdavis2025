import React from 'react';

const Footer: React.FC = () => {
  return (
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
  );
};

export default Footer;