import React from 'react';
import { Link } from 'react-router-dom';
import { FaFutbol, FaHandshake, FaBolt, FaUsers } from 'react-icons/fa';

// Import your existing images
import playnationVisionImage from '../assets/images/categories/playnation-vision.webp'; 
// Import the individual founder images here
import swayamImage from '../assets/images/categories/abcde.jpg'; // Example path, adjust as needed
import harshImage from '../assets/images/categories/xyzc.jpg'; // Example path, adjust as needed
import surbhiImage from '../assets/images/categories/mnop.jpg'; // Example path, adjust as needed

function AboutUsPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-dark-text mb-4">
            About PlayNation
          </h1>
          <p className="text-xl text-medium-text max-w-3xl mx-auto">
            Our mission is to connect sports enthusiasts with the best local venues, making it easy to book a game and play together.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-card-bg rounded-3xl p-10 shadow-lg border border-border-color-light flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-dark-text mb-4">
                Our Vision: Empowering Every Sport Enthusiast
              </h2>
              <p className="text-medium-text leading-relaxed">
                PlayNation was born from a simple idea: booking a sports venue should be as easy as booking a movie ticket. We believe that playing sports should be accessible to everyone, and that connecting with friends for a game should never be a hassle. Our platform offers real-time availability, secure payments, and a seamless booking experience so you can focus on what matters most: the game.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={playnationVisionImage}
                alt="PlayNation Vision - a person writing with a quill pen" 
                className="w-full h-72 object-cover rounded-2xl shadow-md"
              />
            </div>
          </div>
        </section>

        {/* New Individual Owner Profile Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-dark-text text-center mb-12">
            Meet Our Founders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Swayam Shah's Profile */}
            <div className="bg-card-bg rounded-3xl p-8 shadow-lg border border-border-color-light text-center transition-all duration-300 hover:shadow-xl hover:scale-105">
              <img 
                src={swayamImage} // Use the imported image variable
                alt="Swayam Shah - Founder" 
                className="w-36 h-36 object-cover rounded-full mx-auto mb-4" 
              />
              <h3 className="text-2xl font-bold text-dark-text mb-1">
                Swayam Shah
              </h3>
              <p className="text-primary-green text-lg font-medium mb-4">
                co-founder
              
              </p>
              <p className="text-medium-text text-sm leading-relaxed">
               With a strong background in technology, Swayam built the robust and scalable platform that powers PlayNation's seamless booking experience. 
              </p>
            </div>

            {/* Harsh Shah's Profile */}
            <div className="bg-card-bg rounded-3xl p-8 shadow-lg border border-border-color-light text-center transition-all duration-300 hover:shadow-xl hover:scale-105">
              <img 
                src={harshImage} // Use the imported image variable
                alt="Harsh Shah - Co-founder" 
                className="w-36 h-36 object-cover rounded-full mx-auto mb-4" 
              />
              <h3 className="text-2xl font-bold text-dark-text mb-1">
                Harsh Shah
              </h3>
              <p className="text-primary-green text-lg font-medium mb-4">
                Founder
              </p>
              <p className="text-medium-text text-sm leading-relaxed">
                As a lifelong sports enthusiast, Harsh envisioned a platform that would simplify the process of playing, making it accessible to everyone.
              </p>
              
            </div>

            {/* Surbhi Roy's Profile */}
            <div className="bg-card-bg rounded-3xl p-8 shadow-lg border border-border-color-light text-center transition-all duration-300 hover:shadow-xl hover:scale-105">
              <img 
                src={surbhiImage} // Use the imported image variable
                alt="Surbhi Roy - Co-founder" 
                className="w-36 h-36 object-cover rounded-full mx-auto mb-4" 
              />
              <h3 className="text-2xl font-bold text-dark-text mb-1">
                Surbhi Roy
              </h3>
              <p className="text-primary-green text-lg font-medium mb-4">
                Co-founder
              </p>
              <p className="text-medium-text text-sm leading-relaxed">
                Surbhi's expertise in business and marketing has been key to growing the PlayNation community and expanding our network of premium venues.
              </p>
            </div>
          </div>
        </section>


        {/* Key Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-dark-text text-center mb-12">
            Why Choose PlayNation?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card-bg rounded-2xl p-6 shadow-sm border border-border-color-light text-center transition-all duration-300 hover:shadow-md hover:scale-105">
              <FaBolt className="text-4xl text-primary-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-text mb-2">Instant Booking</h3>
              <p className="text-medium-text text-sm">
                Book your favorite sports venue in just a few clicks. No waiting, no phone calls.
              </p>
            </div>
            <div className="bg-card-bg rounded-2xl p-6 shadow-sm border border-border-color-light text-center transition-all duration-300 hover:shadow-md hover:scale-105">
              <FaFutbol className="text-4xl text-primary-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-text mb-2">Variety of Sports</h3>
              <p className="text-medium-text text-sm">
                From football to badminton, we offer a wide range of sports venues to choose from.
              </p>
            </div>
            <div className="bg-card-bg rounded-2xl p-6 shadow-sm border border-border-color-light text-center transition-all duration-300 hover:shadow-md hover:scale-105">
              <FaHandshake className="text-4xl text-primary-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-text mb-2">Verified Venues</h3>
              <p className="text-medium-text text-sm">
                We partner only with top-rated and verified sports facilities for a premium experience.
              </p>
            </div>
            <div className="bg-card-bg rounded-2xl p-6 shadow-sm border border-border-color-light text-center transition-all duration-300 hover:shadow-md hover:scale-105">
              <FaUsers className="text-4xl text-primary-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-text mb-2">Community Focused</h3>
              <p className="text-medium-text text-sm">
                Join a growing community of players and venue owners.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-primary-green rounded-3xl p-12 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Play?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Browse our selection of top-rated venues and book your next game now.
            </p>
            <Link 
              to="/explore" 
              className="px-8 py-4 bg-white text-primary-green font-bold text-lg rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg no-underline"
            >
              Explore Venues
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutUsPage;