"use client";

import { ReactNode, useCallback, useEffect, useId, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Where focus was before the dialog opened, so it can be handed back.
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // Tracks whether the pointer press that started a click began on the
  // backdrop. Without this, drag-selecting text inside the panel and releasing
  // outside it closes the dialog.
  const pressedBackdrop = useRef(false);

  const focusFirst = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const target = panel.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? panel).focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    focusFirst();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Stop the page behind from scrolling while the dialog is up.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose, focusFirst]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]"
      onMouseDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressedBackdrop.current) {
          onClose();
        }
        pressedBackdrop.current = false;
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="bg-background border-2 border-border-strong p-6 max-w-[480px] w-[calc(100%-2rem)] mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none text-2xl text-text-tertiary cursor-pointer w-8 h-8 flex items-center justify-center hover:text-text-primary"
          aria-label="Close modal"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <h3 id={titleId} className="text-xl mb-4">
          {title}
        </h3>

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
