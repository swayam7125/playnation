// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./AuthContext";
import { ModalProvider } from "./ModalContext";
import "./index.css";

// Swiper CSS imports
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ModalProvider>
          {" "}
          {/* <-- THE FIX IS HERE */}
          <App />
        </ModalProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
