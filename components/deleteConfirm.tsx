import React, { useEffect, useRef, useState } from "react";

const messages = {
  en: {
    title: "Are you sure?",
    body: (name: string) =>
      `Do you really want to delete ${name ? `"${name}"` : "this item"}? This process cannot be undone.`,
    cancel: "Cancel",
    confirm: "Confirm",
  },
  // add more locales as needed
  ar: {
    title: "هل أنت متأكد؟",
    body: (name: string) =>
      `هل تريد حقًا حذف ${name ? `"${name}"` : "هذا العنصر"}؟ هذه العملية لا يمكن التراجع عنها.`,
    cancel: "إلغاء",
    confirm: "تأكيد",
  },
};

type DeleteConfirmProps = {
  productName?: string;
  onCancel?: () => void;
  onConfirm?: () => Promise<void> | void;
  locale?: keyof typeof messages;
};

export default function DeleteConfirm({
  productName,
  onCancel,
  onConfirm,
  locale = "en",
}: DeleteConfirmProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const t = messages[locale] ?? messages.en;

  // focus first interactive element on mount
  useEffect(() => {
    const btn = dialogRef.current?.querySelector("button");
    btn?.focus();
  }, []);

  // keyboard shortcuts: Esc = cancel, Enter = confirm
  useEffect(() => {
    const onKey = async (e: any) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel?.();
      } else if (e.key === "Enter") {
        if (!submitting) {
          e.preventDefault();
          await handleConfirm();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitting]);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      aria-describedby="delete-confirm-desc"
      ref={dialogRef}
      className="w-[280px] sm:w-[320px] flex flex-col p-4 relative items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-2xl"
    >
      <div className="text-center p-3 flex-auto justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 flex items-center text-gray-400 mx-auto"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          />
        </svg>

        <h2
          id="delete-confirm-title"
          className="text-xl font-bold py-4 text-gray-100"
        >
          {t.title}
        </h2>

        <p id="delete-confirm-desc" className="text-sm text-gray-400 px-2">
          {t.body(productName || "")}
        </p>
      </div>

      <div className="p-2 mt-2 text-center space-x-1 md:block">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {t.cancel}
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting}
          className="bg-green-500 hover:bg-green-600 px-5 ml-2 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-400 hover:border-green-500 text-white rounded-full transition ease-in duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "…" : t.confirm}
        </button>
      </div>
    </div>
  );
}