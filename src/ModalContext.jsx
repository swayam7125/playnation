import React, { createContext, useState, useContext, useCallback } from "react";
import Modal from "./components/common/Modal";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalQueue, setModalQueue] = useState([]);

  const showModal = useCallback((options) => {
    return new Promise((resolve) => {
      const modal = {
        ...options,
        onConfirm: (result) => {
          setModalQueue((q) => q.slice(1)); // Remove the current modal from the queue
          resolve(result);
        },
        onCancel: () => {
          setModalQueue((q) => q.slice(1)); // Remove the current modal from the queue
          resolve(null);
        },
      };
      setModalQueue((q) => [...q, modal]); // Add the new modal to the end of the queue
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalQueue((q) => q.slice(1));
  }, []);

  const currentModal = modalQueue[0];

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {currentModal && <Modal {...currentModal} />}
    </ModalContext.Provider>
  );
};
