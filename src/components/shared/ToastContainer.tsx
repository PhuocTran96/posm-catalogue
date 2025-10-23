/**
 * ToastContainer Component
 *
 * Container component that renders all active toast notifications
 * Place this at the root level of your app
 */

import { Toast, type ToastProps } from './Toast';

interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, 'onClose'> & { id: string }>;
  onRemoveToast: (id: string) => void;
}

/**
 * Container for rendering multiple toast notifications
 */
export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
