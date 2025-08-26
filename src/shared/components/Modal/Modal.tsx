import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="bg-border rounded-2xl shadow-xl max-w-lg w-full mx-4 p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl"
          aria-label="Close"
        >
          ✕
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}
