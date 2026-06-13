import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="
              pointer-events-auto flex items-start gap-3 rounded-xl border border-white/[0.08]
              bg-zinc-950/90 px-4 py-3 shadow-2xl backdrop-blur-xl animate-slide-in
              transition-all duration-300
            "
            style={{
              animation: 'slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              borderLeft: t.type === 'success' 
                ? '4px solid #10b981' 
                : t.type === 'error' 
                ? '4px solid #ef4444' 
                : '4px solid #f97316'
            }}
          >
            {t.type === 'success' && <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="mt-0.5 h-4.5 w-4.5 text-rose-400 shrink-0" />}
            {t.type === 'info' && <Info className="mt-0.5 h-4.5 w-4.5 text-orange-400 shrink-0" />}

            <div className="flex-1 text-xs font-semibold text-zinc-100 leading-normal">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider');
  }
  return context;
}
