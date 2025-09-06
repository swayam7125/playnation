import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthContext';
import { ModalProvider } from './ModalContext'; // Import ModalProvider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ModalProvider> {/* Wrap App with ModalProvider */}
        <App />
      </ModalProvider>
    </AuthProvider>
  </React.StrictMode>
);