import React from "react";
import { FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: FaShieldAlt,
      title: "Verified Venues",
      description: "All venues are verified and maintain high quality standards",
    },
    {
      icon: FaClock,
      title: "Real-time Booking",
      description: "Instant booking confirmation with live availability updates",
    },
    {
      icon: FaUsers,
      title: "Community Driven",
      description: "Connect with fellow sports enthusiasts in your area",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-text mb-4">
            Why Choose PlayNation?
          </h2>
          <p className="text-xl text-medium-text max-w-2xl mx-auto">
            Experience the future of sports booking with our innovative platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-card-bg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border-color-light">
              <div className="bg-light-green-bg p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-primary-green text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-4">{feature.title}</h3>
              <p className="text-medium-text leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
