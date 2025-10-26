// src/components/common/Modal.jsx
import React from "react";
import { FiX } from "react-icons/fi";

// 👇 --- FIX: Added `onConfirm` and `onCancel` to the props ---
const Modal = ({
  title,
  message,
  onClose,
  onConfirm, // 👈 ADDED THIS PROP
  onCancel, // 👈 ADDED THIS PROP
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
  confirmStyle = "primary",
}) => {
  // 👇 --- FIX: This new function now calls `onConfirm` if it exists ---
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(); // 👈 This will run the navigate() command from VenuePage
    }
    onClose(); // Hides the modal
  };

  // 👇 --- FIX: This new function now calls `onCancel` if it exists ---
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose(); // Hides the modal
  };

  const confirmClasses = {
    primary: "bg-primary-green text-white hover:bg-primary-green-dark",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close on backdrop click
    >
      <div
        className="bg-card-bg rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border-color">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-dark-text">{title}</h3>
            <button
              onClick={onClose}
              className="text-light-text hover:text-dark-text"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {message && (
          <div className="p-6">
            <p className="text-medium-text">{message}</p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-6 bg-background rounded-b-2xl flex justify-end gap-4">
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel} // 👈 FIX: Wired up handleCancel
              className="py-2 px-5 rounded-lg font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm} // 👈 FIX: Wired up handleConfirm
            className={`py-2 px-5 rounded-lg font-semibold text-sm transition-colors ${
              confirmClasses[confirmStyle] || confirmClasses.primary
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;