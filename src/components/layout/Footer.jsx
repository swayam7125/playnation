import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

function Footer() {
  const linkStyles = "text-gray-600 hover:text-primary-green transition-colors duration-300 no-underline text-base font-normal flex items-center gap-2 group";

  return (
    <footer className="bg-gray-50 border-t border-gray-200 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          
          <div className="lg:col-span-1 space-y-7">
            <Link to="/" className="flex items-center gap-3 no-underline group">
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
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-extrabold text-xl text-dark-text mb-6 border-b-2 border-primary-green/50 inline-block pb-2">Contact Us</h4>
            <div className="space-y-3">
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
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-extrabold text-xl text-dark-text mb-6 border-b-2 border-primary-green/50 inline-block pb-2">Legal</h4>
            <ul className="list-none p-0 m-0 space-y-4">
              <li><Link to="/about" className={linkStyles}>About Us</Link></li>
              <li><Link to="/contact" className={linkStyles}>Contact Us</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-600 hover:text-primary-green transition-colors duration-300 font-medium no-underline">
                Terms of Service
              </Link>
              </li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-primary-green transition-colors duration-300 font-medium no-underline">
                Privacy Policy
              </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-gray-600 text-sm font-medium text-center">
              &copy; {new Date().getFullYear()} PlayNation. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;