import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  gradientFrom: string;
  gradientTo: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, quote, gradientFrom, gradientTo }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
      <div className="flex items-center mb-4 gap-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}></div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-blue-300">{role}</p>
        </div>
      </div>
      <p className="text-blue-100">{quote}</p>
    </div>
  );
};

export default TestimonialCard;