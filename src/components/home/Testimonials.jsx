import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Cricket Enthusiast",
      content: "PlayNation made booking our weekly cricket matches so much easier. No more calling around!",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Badminton Player",
      content: "Love how I can see real-time availability and book instantly. The app is super user-friendly.",
      rating: 5,
    },
    {
      name: "Amit Kumar",
      role: "Football Coach",
      content: "Managing team bookings has never been simpler. PlayNation is a game-changer for sports communities.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-text mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-medium-text">
            Real feedback from our sports community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card-bg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border-color-light">
              <div className="mb-6">
                <FaQuoteLeft className="text-primary-green text-2xl mb-4" />
                <p className="text-medium-text leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-dark-text">{testimonial.name}</h4>
                  <p className="text-sm text-light-text">{testimonial.role}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
