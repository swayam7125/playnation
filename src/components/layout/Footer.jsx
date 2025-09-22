import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

function Footer() {
  const linkStyles = "text-medium-text hover:text-primary-green transition-all duration-300 no-underline text-sm font-medium";
  const socialLinkStyles = "w-10 h-10 bg-background backdrop-blur-sm border border-border-color rounded-lg flex items-center justify-center text-medium-text hover:text-primary-green hover:bg-light-green-bg/50 hover:border-primary-green/30 transition-all duration-300 hover:shadow-sm";

  return (
    <footer className="bg-background backdrop-blur-md border-t border-border-color">
      {/* Newsletter Section */}
      <div className="bg-hover-bg/90 backdrop-blur-md border-b border-border-color">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-hover-bg backdrop-blur-sm rounded-2xl p-8 border border-border-color shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-dark-text mb-2">
                  Stay Updated with PlayNation
                </h3>
                <p className="text-medium-text">
                  Get the latest venue updates and exclusive offers
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-xl bg-background border border-border-color text-dark-text placeholder-light-text focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green/30 transition-all duration-300 min-w-72"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-primary-green to-primary-green-dark text-white font-medium rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 no-underline mb-6 group">
              <div className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white font-bold text-lg h-11 w-11 grid place-content-center rounded-xl shadow-lg group-hover:shadow-primary-green/25 group-hover:scale-105 transition-all duration-300">
                PN
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-dark-text to-medium-text bg-clip-text text-transparent group-hover:from-primary-green group-hover:to-primary-green-dark transition-all duration-300">
                PlayNation
              </span>
            </Link>

            {/* Contact Info */}
            <div className="bg-hover-bg backdrop-blur-sm rounded-xl p-5 border border-border-color mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-light-green-bg/50 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-primary-green text-xs" />
                  </div>
                  <span className="text-medium-text">Surat, Gujarat, India</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-light-green-bg/50 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-primary-green text-xs" />
                  </div>
                  <a href="mailto:hello@playnation.com" className={linkStyles}>
                    hello@playnation.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-light-green-bg/50 rounded-lg flex items-center justify-center">
                    <FaPhone className="text-primary-green text-xs" />
                  </div>
                  <a href="tel:+911234567890" className={linkStyles}>
                    +91 6353040453
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className={socialLinkStyles}>
                <FaFacebook className="text-sm" />
              </a>
              <a href="#" aria-label="Twitter" className={socialLinkStyles}>
                <FaTwitter className="text-sm" />
              </a>
              <a href="#" aria-label="Instagram" className={socialLinkStyles}>
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" aria-label="LinkedIn" className={socialLinkStyles}>
                <FaLinkedin className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-dark-text mb-6">Quick Links</h4>
            <div className="bg-hover-bg backdrop-blur-sm rounded-xl p-5 border border-border-color">
              <ul className="list-none p-0 m-0 space-y-3">
                <li><Link to="/explore" className={linkStyles}>Explore Venues</Link></li>
                <li><Link to="#" className={linkStyles}>Special Offers</Link></li>
                <li><Link to="#" className={linkStyles}>Sports Categories</Link></li>
                <li><Link to="#" className={linkStyles}>Book Now</Link></li>
                <li><Link to="#" className={linkStyles}>Mobile App</Link></li>
              </ul>
            </div>
          </div>

          {/* For Venues */}
          <div>
            <h4 className="font-semibold text-dark-text mb-6">For Venues</h4>
            <div className="bg-hover-bg backdrop-blur-sm rounded-xl p-5 border border-border-color">
              <ul className="list-none p-0 m-0 space-y-3">
                <li><Link to="#" className={linkStyles}>List Your Venue</Link></li>
                <li><Link to="#" className={linkStyles}>Owner Dashboard</Link></li>
                <li><Link to="#" className={linkStyles}>Pricing Guide</Link></li>
                <li><Link to="#" className={linkStyles}>Partner Support</Link></li>
                <li><Link to="#" className={linkStyles}>Analytics</Link></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-dark-text mb-6">Company</h4>
            <div className="bg-hover-bg backdrop-blur-sm rounded-xl p-5 border border-border-color">
              <ul className="list-none p-0 m-0 space-y-3">
                <li><Link to="#" className={linkStyles}>About Us</Link></li>
                <li><Link to="#" className={linkStyles}>Careers</Link></li>
                <li><Link to="#" className={linkStyles}>Contact</Link></li>
                <li><Link to="#" className={linkStyles}>Help Center</Link></li>
                <li><Link to="#" className={linkStyles}>Blog</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-12 border-t border-border-color">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-hover-bg backdrop-blur-sm rounded-xl p-6 border border-border-color text-center hover:bg-light-green-bg/30 hover:border-primary-green/20 transition-all duration-300">
              <div className="text-2xl font-bold text-primary-green">1000+</div>
              <div className="text-medium-text text-sm font-medium">Venues</div>
            </div>
            <div className="bg-hover-bg backdrop-blur-sm rounded-xl p-6 border border-border-color text-center hover:bg-light-green-bg/30 hover:border-primary-green/20 transition-all duration-300">
              <div className="text-2xl font-bold text-primary-green">50K+</div>
              <div className="text-medium-text text-sm font-medium">Users</div>
            </div>
            <div className="bg-hover-bg backdrop-blur-sm rounded-xl p-6 border border-border-color text-center hover:bg-light-green-bg/30 hover:border-primary-green/20 transition-all duration-300">
              <div className="text-2xl font-bold text-primary-green">25+</div>
              <div className="text-medium-text text-sm font-medium">Sports</div>
            </div>
            <div className="bg-hover-bg backdrop-blur-sm rounded-xl p-6 border border-border-color text-center hover:bg-light-green-bg/30 hover:border-primary-green/20 transition-all duration-300">
              <div className="text-2xl font-bold text-primary-green">24/7</div>
              <div className="text-medium-text text-sm font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Links */}
      <div className="bg-hover-bg/90 backdrop-blur-md border-t border-border-color">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-medium-text text-sm">
              &copy; {new Date().getFullYear()} PlayNation. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="#" className="text-medium-text hover:text-primary-green transition-colors duration-300 no-underline">
                Terms of Service
              </Link>
              <Link to="#" className="text-medium-text hover:text-primary-green transition-colors duration-300 no-underline">
                Privacy Policy
              </Link>
              <Link to="#" className="text-medium-text hover:text-primary-green transition-colors duration-300 no-underline">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;