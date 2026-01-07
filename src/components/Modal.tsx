"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-background border-2 border-border-strong p-6 max-w-[480px] w-[calc(100%-2rem)] mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none text-2xl text-text-tertiary cursor-pointer w-8 h-8 flex items-center justify-center hover:text-text-primary"
          aria-label="Close modal"
        >
          ×
        </button>

        <h3 className="text-xl mb-4">{title}</h3>

        <div
          className={`text-text-secondary leading-relaxed ${footer ? "mb-6" : ""}`}
        >
          {children}
        </div>

        {footer && (
          <div className="flex gap-4 justify-end flex-wrap">{footer}</div>
        )}
      </div>
    </div>
  );
}
