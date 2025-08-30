import React from 'react';
import { FaTimes, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const icons = {
  confirm: <FaCheck />,
  error: <FaExclamationTriangle />,
  info: <FaInfoCircle />,
};

const Modal = ({ type = 'info', title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' }) => {
  if (!message) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className={`modal-content modal-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {icons[type] && <span className="modal-icon">{icons[type]}</span>}
          <h3 className="modal-title">{title || 'Notification'}</h3>
          <button onClick={onCancel} className="modal-close-btn"><FaTimes /></button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          {type === 'confirm' && (
            <button onClick={onCancel} className="btn btn-secondary">{cancelText}</button>
          )}
          <button onClick={onConfirm} className={`btn ${type === 'error' ? 'btn-danger' : 'btn-primary'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;