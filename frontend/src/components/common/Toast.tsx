import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Toast.css';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 size={18} color="#4ADE80" strokeWidth={2.4} />;
            case 'warning':
            case 'error':
              return <AlertCircle size={18} color="#F87171" strokeWidth={2.4} />;
            default:
              return <Info size={18} color="#38BDF8" strokeWidth={2.4} />;
          }
        };

        return (
          <div key={toast.id} className="toast-card">
            <div className="toast-content">
              <span className="toast-icon">{getIcon()}</span>
              <div className="toast-text">
                <span className="toast-title">{toast.title}</span>
                {toast.message && <span className="toast-message">{toast.message}</span>}
              </div>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
