import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone, FaArrowRight } from 'react-icons/fa';

function Footer() {
  // Enhanced link styles for better visual presence and hover effect
  const linkStyles = "text-gray-600 hover:text-primary-green transition-colors duration-300 no-underline text-base font-normal flex items-center gap-2 group";
  
  // Enhanced social link styles with focus on color
  const socialLinkStyles = "w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary-green transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary-green";

  return (
    // Main background: slightly off-white for visual separation from page content
    <footer className="bg-gray-50 border-t border-gray-200 shadow-inner">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* 1. Brand & Contact Section (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-7">
            <Link to="/" className="flex items-center gap-3 no-underline group">
              {/* Vibrant Logo - Larger size for brand impact */}
              <div className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white font-extrabold text-xl h-14 w-14 grid place-content-center rounded-xl shadow-xl group-hover:shadow-primary-green/50 group-hover:scale-[1.05] transition-all duration-300">
                PN
              </div>
              <span className="font-black text-3xl text-dark-text tracking-tight group-hover:text-primary-green transition-colors duration-300">
                PlayNation
              </span>
            </Link>

            <p className="text-gray-700 max-w-sm leading-relaxed text-md">
                The premier platform for discovering and booking the best sports facilities. **Play more, book easy.**
            </p>

            {/* Contact Info - Cleaned up and integrated */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4 text-md">
                    <FaMapMarkerAlt className="text-primary-green w-5 h-5 flex-shrink-0" />
                    <span className="text-dark-text font-medium">Surat, Gujarat, India</span>
                </div>
                <div className="flex items-center gap-4 text-md">
                    <FaEnvelope className="text-primary-green w-5 h-5 flex-shrink-0" />
                    <a href="mailto:hello@playnation.com" className="text-gray-600 hover:text-primary-green transition-colors duration-300 no-underline">
                    hello@playnation.com
                    </a>
                </div>
                <div className="flex items-center gap-4 text-md">
                    <FaPhone className="text-primary-green w-5 h-5 flex-shrink-0" />
                    <a href="tel:+911234567890" className="text-gray-600 hover:text-primary-green transition-colors duration-300 no-underline">
                    +91 6353040453
                    </a>
                </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-6">
              <a href="#" aria-label="Facebook" className={socialLinkStyles}>
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" aria-label="Twitter" className={socialLinkStyles}>
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" aria-label="Instagram" className={socialLinkStyles}>
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" aria-label="LinkedIn" className={socialLinkStyles}>
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="font-extrabold text-xl text-dark-text mb-6 border-b-2 border-primary-green/50 inline-block pb-2">Quick Links</h4>
            <ul className="list-none p-0 m-0 space-y-4">
              <li><Link to="/explore" className={linkStyles}>Explore Venues <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Special Offers <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Sports Categories <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Book Now <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Mobile App <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
            </ul>
          </div>

          {/* 3. For Venues */}
          <div>
            <h4 className="font-extrabold text-xl text-dark-text mb-6 border-b-2 border-primary-green/50 inline-block pb-2">For Venues</h4>
            <ul className="list-none p-0 m-0 space-y-4">
              <li><Link to="#" className={linkStyles}>List Your Venue <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Owner Dashboard <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Pricing Guide <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Partner Support <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Analytics <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
            </ul>
          </div>

          {/* 4. Company */}
          <div>
            <h4 className="font-extrabold text-xl text-dark-text mb-6 border-b-2 border-primary-green/50 inline-block pb-2">Company</h4>
            <ul className="list-none p-0 m-0 space-y-4">
              <li><Link to="/about" className={linkStyles}>About Us <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Careers <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Contact Us <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Help Center <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
              <li><Link to="#" className={linkStyles}>Blog <FaArrowRight className="w-3 h-3 text-transparent group-hover:text-primary-green transition-colors" /></Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Links (Copyright bar) - Darker and highly defined */}
      <div className="bg-gray-200 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm font-medium">
              &copy; {new Date().getFullYear()} **PlayNation**. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="#" className="text-gray-600 hover:text-primary-green transition-colors duration-300 font-medium no-underline">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-600 hover:text-primary-green transition-colors duration-300 font-medium no-underline">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-600 hover:text-primary-green transition-colors duration-300 font-medium no-underline">
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