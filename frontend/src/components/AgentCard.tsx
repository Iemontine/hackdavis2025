import React from 'react';

interface AgentCardProps {
  name: string;
  role: string;
  quote: string;
  gradientFrom: string;
  gradientTo: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, role, quote, gradientFrom, gradientTo }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all">
      <div className="flex items-center mb-6 gap-3">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-r from-${gradientFrom} to-${gradientTo} flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-xl">{name}</h4>
          <p className="text-sm text-blue-300">{role}</p>
        </div>
      </div>
      
      <p className="text-blue-100 relative pl-4 before:content-[] before:absolute before:left-0 before:top-0 before:text-blue-400 before:text-xl before:font-serif">
        {quote}
      </p>
      
      <div className="mt-6 flex justify-center">
        <button className="px-4 py-2 text-sm bg-blue-600/30 hover:bg-blue-600/50 rounded-lg border border-blue-500/30 transition-colors">/
          Learn More
        </button>
      </div>
    </div>
  );
};
  

export default AgentCard;