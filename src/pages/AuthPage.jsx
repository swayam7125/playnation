// src/pages/AuthPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    setIsLoginView(location.pathname === '/login');
  }, [location.pathname]);

  const toggleView = () => {
    if (isLoginView) {
      // Pass the location state when navigating to signup
      navigate('/signup', { state: location.state });
    } else {
      // Pass the location state back when navigating to login
      navigate('/login', { state: location.state });
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLoginView ? 'login-view' : 'register-view'}`}>
        {isLoginView ? (
          <>
            <h2 className="auth-title">Login to PlayNation</h2>
            <LoginForm />
            <p className="auth-toggle-text">
              Don't have an account?{' '}
              <button onClick={toggleView} className="auth-toggle-button">
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="auth-title">Create Your Account</h2>
            <RegisterForm />
            <p className="auth-toggle-text">
              Already have an account?{' '}
              <button onClick={toggleView} className="auth-toggle-button">
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;