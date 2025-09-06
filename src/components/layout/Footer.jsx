import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  const linkStyles = "text-light-text hover:text-primary-green transition duration-300 no-underline";

  return (
    <footer className="bg-card-bg border-t border-border-color text-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 no-underline mb-4">
              <div className="bg-primary-green text-white font-extrabold text-base h-9 w-9 grid place-content-center rounded-lg shadow-md">
                PN
              </div>
              <span className="font-extrabold text-xl text-dark-text">PlayNation</span>
            </Link>
            <p className="text-light-text leading-relaxed mt-4">
              Your one-stop destination for booking sports facilities. No calls, no waiting. Just play.
            </p>
            <div className="flex gap-5 mt-6 text-xl">
              <a href="#" aria-label="Facebook" className={linkStyles}><FaFacebook /></a>
              <a href="#" aria-label="Twitter" className={linkStyles}><FaTwitter /></a>
              <a href="#" aria-label="Instagram" className={linkStyles}><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn" className={linkStyles}><FaLinkedin /></a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-dark-text mb-4">Explore</h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                <li><Link to="/explore" className={linkStyles}>Venues</Link></li>
                <li><Link to="#" className={linkStyles}>Offers</Link></li>
                <li><Link to="#" className={linkStyles}>Sports</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-dark-text mb-4">Company</h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                <li><Link to="#" className={linkStyles}>About Us</Link></li>
                <li><Link to="#" className={linkStyles}>Careers</Link></li>
                <li><Link to="#" className={linkStyles}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-dark-text mb-4">Legal</h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                <li><Link to="#" className={linkStyles}>Terms of Service</Link></li>
                <li><Link to="#" className={linkStyles}>Privacy Policy</Link></li>
                <li><Link to="#" className={linkStyles}>Refund Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-hover-bg border-t border-border-color-light">
        <div className="container mx-auto px-4 py-4 text-center text-light-text">
          <p>&copy; {new Date().getFullYear()} PlayNation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;