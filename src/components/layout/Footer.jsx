import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

function Footer() {
  const linkStyles = "text-medium-text hover:text-primary-green transition-all duration-300 no-underline text-sm font-medium";
  const socialLinkStyles = "w-10 h-10 bg-background backdrop-blur-sm border border-border-color rounded-lg flex items-center justify-center text-medium-text hover:text-primary-green hover:bg-light-green-bg/50 hover:border-primary-green/30 transition-all duration-300 hover:shadow-sm";

  return (
    <footer className="bg-background backdrop-blur-md border-t border-border-color">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 no-underline group">
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
                <li><Link to="/about" className={linkStyles}>About Us</Link></li>
                <li><Link to="#" className={linkStyles}>Careers</Link></li>
                <li><Link to="#" className={linkStyles}>Contact</Link></li>
                <li><Link to="#" className={linkStyles}>Help Center</Link></li>
                <li><Link to="#" className={linkStyles}>Blog</Link></li>
              </ul>
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