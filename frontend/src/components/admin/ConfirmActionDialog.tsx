import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  intent?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmActionDialog: React.FC<ConfirmActionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  intent = 'primary',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (intent) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
          iconBg: 'bg-rose-50',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-50',
          btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'primary':
      default:
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-[#F52B68]" />,
          iconBg: 'bg-pink-50',
          btnBg: 'bg-[#F52B68] hover:bg-[#E01E5A] text-white',
        };
    }
  };

  const { icon, iconBg, btnBg } = getColors();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#071B3A]/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
          <div className="flex-1 min-w-0">
            <h3 id="dialog-title" className="text-lg font-bold text-[#172033]">
              {title}
            </h3>
            <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 ${btnBg}`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
