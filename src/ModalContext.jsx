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
          {...modalProps}
          onClose={() => {
            if (modalProps.onClose) {
              modalProps.onClose();
            }
            hideModal();
          }}
          onConfirm={modalProps.onConfirm}
          onCancel={modalProps.onCancel}
        />
      )}
    </ModalContext.Provider>
  );
};