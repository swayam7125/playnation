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
        onConfirm: (result) => {
          setModalState(null);
          resolve(result); // Resolve with the input value or true
        },
        onCancel: () => {
          setModalState(null);
          resolve(null); // Resolve with null when cancelled
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