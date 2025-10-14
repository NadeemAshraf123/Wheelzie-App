import React from "react";

interface ModalWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper = ({ onClose, children }: ModalWrapperProps) => {
  return (
    <div
      className="fixed inset-0 bg-opacity-90 flex items-center justify-center z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
