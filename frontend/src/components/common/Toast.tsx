import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from '@/utils/helpers';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = toastIcons[type];

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={clsx(
        'flex items-start p-4 rounded-lg border shadow-lg max-w-sm w-full transition-all duration-300 transform',
        toastStyles[type],
        isVisible && !isLeaving ? 'animate-slideInRight' : 'opacity-0 translate-x-full',
        isLeaving && 'opacity-0 translate-x-full'
      )}
      role="alert"
    >
      <Icon className={clsx('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[type])} />
      <div className="ml-3 flex-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
      <button
        onClick={handleClose}
        className="ml-3 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Context and Provider
interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const showSuccess = (title: string, message?: string) => showToast('success', title, message);
  const showError = (title: string, message?: string) => showToast('error', title, message);
  const showWarning = (title: string, message?: string) => showToast('warning', title, message);
  const showInfo = (title: string, message?: string) => showToast('info', title, message);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={handleClose} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
