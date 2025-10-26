// src/ModalContext.jsx
import React, { createContext, useContext, useState } from "react";
import Modal from "./components/common/Modal"; // Assuming this is the correct path

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalProps, setModalProps] = useState(null);

  const showModal = (props) => {
    setModalProps(props);
  };

  const hideModal = () => {
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalProps && (
        <Modal
          {...modalProps} // 👈 *** THIS IS THE FIX ***
          onClose={() => {
            // Ensure onClose logic from props is also called if it exists
            if (modalProps.onClose) {
              modalProps.onClose();
            }
            hideModal(); // Always hide the modal
          }}
        />
      )}
    </ModalContext.Provider>
  );
};