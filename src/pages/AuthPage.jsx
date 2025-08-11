import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
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
            {/* The prop is no longer needed here */}
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