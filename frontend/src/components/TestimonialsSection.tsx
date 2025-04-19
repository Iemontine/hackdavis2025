import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">What Our Users Are Saying</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard 
            name="Alex T."
            role="Fitness Beginner"
            quote="As someone new to working out, having an AI coach guide me through each exercise has been incredible. I never feel lost anymore!"
            gradientFrom="blue-400"
            gradientTo="indigo-400"
          />
          
          <TestimonialCard 
            name="Jamie K."
            role="Busy Professional"
            quote="The voice-controlled workouts are game-changing. I can focus on my form while the AI handles timing and progression."
            gradientFrom="purple-400"
            gradientTo="pink-400"
          />
          
          <TestimonialCard 
            name="Morgan P."
            role="Advanced Athlete"
            quote="Even as an experienced lifter, the AI constantly challenges me with new routines that keep pushing my limits."
            gradientFrom="green-400"
            gradientTo="teal-400"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;