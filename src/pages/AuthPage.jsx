// src/pages/AuthPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { FaFutbol, FaCheckCircle } from 'react-icons/fa';

import authBgImage from '../assets/images/categories/playnation-vision.webp';

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    setIsLoginView(location.pathname === '/login');
  }, [location.pathname]);

  // --- THIS IS THE FIX ---
  // This effect adds `overflow-hidden` to the body when the component mounts,
  // preventing the page from scrolling. It cleans up by removing the class
  // when the component unmounts (when you navigate to another page).
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  // --- END OF FIX ---

  const toggleView = (path) => {
    navigate(path, { state: location.state, replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex justify-center py-12 px-4 auth-page-background">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-card-bg/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-border-color-light overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Branding & Info */}
          <div 
            className="hidden md:flex flex-col justify-center p-8 bg-cover bg-center text-white"
            style={{ backgroundImage: `linear-gradient(rgba(22, 163, 74, 0.8), rgba(6, 95, 70, 0.9)), url(${authBgImage})` }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FaFutbol className="text-3xl" />
                <span className="font-bold text-2xl">PlayNation</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight mb-3">
                Join the Ultimate Sports Community.
              </h2>
              <p className="text-sm opacity-90 mb-6">
                Discover, book, and play at the best sports venues near you.
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <FaCheckCircle />
                <span>Instant Online Bookings</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle />
                <span>Verified High-Quality Venues</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle />
                <span>Exclusive Deals and Offers</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Form */}
          <div className="p-8 flex flex-col">
            {isLoginView ? (
              <>
                <h2 className="text-xl font-bold text-dark-text mb-1">Welcome Back!</h2>
                <p className="text-medium-text mb-6">
                  Sign in to continue.
                </p>
                <LoginForm />
                <p className="text-center mt-6 text-xs text-medium-text">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => toggleView('/signup')} 
                    className="font-semibold text-primary-green hover:underline focus:outline-none"
                  >
                    Register here
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-dark-text mb-1">Create Your Account</h2>
                <p className="text-medium-text mb-6">
                  Get started in minutes.
                </p>
                <RegisterForm />
                <p className="text-center mt-6 text-xs text-medium-text">
                  Already have an account?{' '}
                  <button 
                    onClick={() => toggleView('/login')} 
                    className="font-semibold text-primary-green hover:underline focus:outline-none"
                  >
                    Login here
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;