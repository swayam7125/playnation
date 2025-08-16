import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm'; // Corrected import path
import RegisterForm from '../components/auth/RegisterForm'; // Corrected import path

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
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