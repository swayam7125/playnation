import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

function Modal({ title, message, onConfirm, onCancel, isInput = false, inputPlaceholder, confirmText = "Confirm", confirmStyle = "primary" }) {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    onConfirm(isInput ? inputValue : true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onCancel}>
          <FaTimes />
        </button>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        {isInput && (
          <textarea
            className="modal-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            rows="4"
          />
        )}

        <div className="modal-actions">
          <button className={`btn btn-${confirmStyle}`} onClick={handleConfirm}>
            {confirmText}
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;