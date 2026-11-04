import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from '@/utils/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative bg-white shadow-xl w-full transform transition-all',
          'rounded-t-2xl sm:rounded-2xl',
          'max-h-[92vh] sm:max-h-[85vh] flex flex-col',
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        <div className="p-4 sm:p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};