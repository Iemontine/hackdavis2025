import React from 'react';
import AgentCard from './AgentCard';

const AgentSection: React.FC = () => {
  return (
    <section id="agents" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Specialized AI Fitness Agents</h2>
        <p className="text-xl text-blue-200 text-center mb-16 max-w-3xl mx-auto">
          Our AI adapts to your specific fitness goals with specialized coaching styles
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AgentCard 
            name="Muscle Builder"
            role="Strength & Hypertrophy Agent"
            quote="I'll design progressive overload programs focused on compound movements and proper intensity techniques to maximize muscle growth and strength gains."
            gradientFrom="blue-400"
            gradientTo="indigo-400"
          />
          
          <AgentCard 
            name="Weight Loss Coach"
            role="Fat Loss & Metabolism Agent"
            quote="My approach combines efficient HIIT cardio with strategic resistance training to optimize caloric burn while preserving lean muscle mass."
            gradientFrom="purple-400"
            gradientTo="pink-400"
          />
          
          <AgentCard 
            name="Endurance Trainer"
            role="Stamina & Performance Agent"
            quote="I specialize in gradually increasing your cardiovascular capacity and muscular endurance through periodized training that prevents plateaus."
            gradientFrom="green-400"
            gradientTo="teal-400"
          />
        </div>
      </div>
    </section>
  );
};

export default AgentSection;