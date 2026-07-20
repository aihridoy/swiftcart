"use client";

import React from "react";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-gray-800">
          {title}
        </h2>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            className={`px-4 py-2 rounded-lg font-medium text-white transition ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-gray-800"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
