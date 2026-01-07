"use client";

import { useVimMode } from "../hooks/useVimMode";

export default function VimStatusBar() {
  const { vimModeEnabled, vimMode, searchTerm } = useVimMode();

  if (!vimModeEnabled) return null;

  const getCurrentPage = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      switch (path) {
        case "/":
          return "~/index.tsx";
        case "/about":
          return "~/about/page.tsx";
        case "/writing":
          return "~/writing/page.tsx";
        case "/bookmarks":
          return "~/bookmarks/page.tsx";
        case "/vim":
          return "~/vim/page.tsx";
        default:
          return `~${path}/page.tsx`;
      }
    }
    return "~/page.tsx";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-text-primary text-background px-4 py-2 text-sm font-mono flex justify-between items-center z-[1000] border-t border-border">
      <div className="flex items-center gap-4">
        <span
          className={`px-2 py-1 rounded-sm font-bold ${
            vimMode === "normal"
              ? "bg-background text-text-primary"
              : "bg-transparent text-background"
          }`}
        >
          {vimMode === "normal" ? "NORMAL" : "SEARCH"}
        </span>

        {vimMode === "search" && (
          <span>
            /{searchTerm}
            <span className="opacity-70">_</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span>{getCurrentPage()}</span>
        <span className="opacity-70">
          {typeof window !== "undefined" && `${Math.round(window.scrollY)}px`}
        </span>
      </div>
    </div>
  );
}
