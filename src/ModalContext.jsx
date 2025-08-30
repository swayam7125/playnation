import React, { createContext, useState, useContext, useCallback } from 'react';
import Modal from './components/common/Modal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState(null);

  const showModal = useCallback((options) => {
    return new Promise((resolve) => {
      setModalState({
        ...options,
        onConfirm: () => {
          setModalState(null);
          resolve(true); // Resolve with 'true' when confirmed
        },
        onCancel: () => {
          setModalState(null);
          resolve(false); // Resolve with 'false' when cancelled
        },
      });
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(null);
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalState && <Modal {...modalState} />}
    </ModalContext.Provider>
  );
};