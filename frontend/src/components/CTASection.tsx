import React from 'react';

const CTASection: React.FC = () => {
  return (
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
  );
};

export default CTASection;