import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

function Modal({ title, message, onConfirm, onCancel, isInput = false, inputPlaceholder, confirmText = "Confirm", confirmStyle = "primary" }) {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    onConfirm(isInput ? inputValue : true);
  };

  const confirmButtonStyles = confirmStyle === 'primary' 
    ? "bg-primary-green text-white hover:bg-primary-green-dark" 
    : "bg-red-100 text-red-700 border border-red-300 hover:bg-red-600 hover:text-white";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-card-bg rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4 text-light-text hover:text-dark-text transition" onClick={onCancel}>
          <FaTimes />
        </button>
        <h3 className="text-xl font-bold text-dark-text mb-2">{title}</h3>
        <p className="text-medium-text mb-4">{message}</p>
        
        {isInput && (
          <textarea
            className="w-full p-3 border border-border-color rounded-lg text-sm bg-card-bg text-dark-text transition duration-300 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            rows="4"
          />
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button 
            className="py-2 px-5 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-card-bg text-medium-text border border-border-color shadow-sm hover:bg-hover-bg hover:border-primary-green hover:text-primary-green" 
            onClick={onCancel}>
            Cancel
          </button>
          <button 
            className={`py-2 px-5 rounded-lg font-semibold text-sm transition duration-300 no-underline shadow-sm ${confirmButtonStyles}`} 
            onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;