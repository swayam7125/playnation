import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import heroImage from "../../assets/images/hero/hero-img-1.svg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-green/5 to-primary-green-light/10">
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 min-h-[600px] py-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-dark-text">
                Book Sports Venues in
                <span className="text-primary-green block">Seconds</span>
              </h1>
              <p className="text-xl text-medium-text leading-relaxed max-w-lg">
                Real-time availability for turfs, courts, and tables near you. No calls, no waiting, just play.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/explore"
                className="group bg-primary-green text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:bg-primary-green-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3"
              >
                Start Playing
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/how-it-works"
                className="bg-card-bg text-dark-text px-8 py-4 rounded-xl font-semibold text-lg border-2 border-border-color hover:border-primary-green transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg"
              >
                <FaPlay className="text-primary-green" />
                How It Works
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green/20 to-primary-green-light/20 rounded-3xl blur-3xl transform -rotate-6 scale-110"></div>
            <div className="relative bg-card-bg rounded-3xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
              <img
                src={heroImage}
                alt="Sports venues and activities"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
