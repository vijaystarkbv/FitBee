import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="font-bold text-base text-zinc-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 font-bold text-lg p-1"
          >
            ×
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
