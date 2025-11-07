import React from "react";
import { FaSearch, FaCalendarAlt, FaPlay, FaArrowRight } from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: FaSearch,
      title: "Discover",
      description: "Find the best sports venues near you with real-time availability.",
      step: "01",
    },
    {
      icon: FaCalendarAlt,
      title: "Book",
      description: "Select your preferred time slot and book instantly.",
      step: "02",
    },
    {
      icon: FaPlay,
      title: "Play",
      description: "Arrive at the venue and enjoy your game.",
      step: "03",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-text mb-4">How It Works</h2>
          <p className="text-xl text-medium-text">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative text-center group">
              <div className="absolute -top-4 -right-4 text-6xl font-bold text-primary-green/10 group-hover:text-primary-green/20 transition-colors duration-300">
                {item.step}
              </div>
              <div className="bg-gradient-to-br from-primary-green to-primary-green-dark p-6 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <item.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-dark-text mb-4">{item.title}</h3>
              <p className="text-medium-text leading-relaxed">{item.description}</p>
              {index < 2 && (
                <div className="hidden md:block absolute top-10 -right-8 text-primary-green/30">
                  <FaArrowRight className="text-2xl" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
