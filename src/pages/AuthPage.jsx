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
    const targetPath = isLoginView ? '/signup' : '/login';
    navigate(targetPath, { state: location.state });
  };

  return (
    <div className="bg-background flex justify-center items-center p-5">
      <div className="bg-card-bg p-8 rounded-xl border border-border-color shadow-xl w-full max-w-2xl">
        {isLoginView ? (
          <>
            <h2 className="text-center text-3xl font-extrabold mb-8 text-dark-text">Login to PlayNation</h2>
            <LoginForm />
            <p className="text-center mt-8 text-sm text-light-text">
              Don't have an account?{' '}
              <button onClick={toggleView} className="bg-none border-none text-primary-green font-bold cursor-pointer text-sm transition duration-300 hover:underline">
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-center text-3xl font-extrabold mb-8 text-dark-text">Create Your Account</h2>
            <RegisterForm />
            <p className="text-center mt-8 text-sm text-light-text">
              Already have an account?{' '}
              <button onClick={toggleView} className="bg-none border-none text-primary-green font-bold cursor-pointer text-sm transition duration-300 hover:underline">
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