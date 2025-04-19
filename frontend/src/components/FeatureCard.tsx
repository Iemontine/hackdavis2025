import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all">
      <div className="rounded-full bg-blue-500 w-16 h-16 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  );
};

export default FeatureCard;