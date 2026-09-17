"use client";

import React from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { usePlant } from "../../context/PlantContext";
import { AlertTriangle, Trash2 } from "lucide-react";

export function ConfirmDeleteModal() {
  const { deleteConfirmState, closeDeleteConfirm } = usePlant();

  if (!deleteConfirmState || !deleteConfirmState.isOpen) return null;

  const handleConfirm = () => {
    deleteConfirmState.onConfirm();
    closeDeleteConfirm();
  };

  return (
    <Modal
      isOpen={deleteConfirmState.isOpen}
      onClose={closeDeleteConfirm}
      title={deleteConfirmState.title}
      description="This action cannot be undone."
      maxWidth="sm"
    >
      <div className="space-y-4 text-xs font-sans">
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-rose-950 font-sans text-xs">
              Confirm Permanent Deletion
            </p>
            <p className="text-rose-800 leading-relaxed text-[11px]">
              {deleteConfirmState.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={closeDeleteConfirm}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            className="text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {deleteConfirmState.confirmLabel || "Delete Item"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
