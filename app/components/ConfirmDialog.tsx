"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  title,
  subtitle,
  confirmLabel = "Submit",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isSubmitting = false,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[3000]">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-[25px] shadow-xl max-w-md w-full mx-4 p-8"
      >
        <h2 className="text-xl font-bold text-[#48BF7E] mb-4 text-center">
          {title}
        </h2>
        <p className="text-gray-600 mb-6 text-center">{subtitle}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="cursor-pointer px-6 py-3 rounded-[25px] font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="cursor-pointer px-6 py-3 rounded-[25px] font-medium bg-[#48BF7E] hover:bg-[#48BF7E]/80 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
