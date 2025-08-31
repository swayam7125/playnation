import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-about">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-box">PN</div>
            <span className="nav-logo-text">PlayNation</span>
          </Link>
          <p className="footer-about-text">
            Your one-stop destination for booking sports facilities. No calls, no waiting. Just play.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
        <div className="footer-links-grid">
          <div className="footer-links-column">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/explore">Venues</Link></li>
              <li><Link to="#">Offers</Link></li>
              <li><Link to="#">Sports</Link></li>
            </ul>
          </div>
          <div className="footer-links-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="#">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-links-column">
            <h4>Legal</h4>
            <ul>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PlayNation. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;