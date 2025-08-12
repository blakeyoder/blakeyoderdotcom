import { useState, useEffect, useCallback } from 'react';

export function useVimMode() {
  const [vimModeEnabled, setVimModeEnabled] = useState(false);
  const [vimMode, setVimMode] = useState<'normal' | 'search'>('normal');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedMode = localStorage.getItem('vim-mode') === 'true';
    setVimModeEnabled(savedMode);

    const handleVimModeChange = (event: CustomEvent) => {
      setVimModeEnabled(event.detail.enabled);
    };

    window.addEventListener('vim-mode-changed', handleVimModeChange as EventListener);
    return () => window.removeEventListener('vim-mode-changed', handleVimModeChange as EventListener);
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!vimModeEnabled) return;

    // Don't interfere with form inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    if (vimMode === 'search') {
      if (event.key === 'Escape') {
        setVimMode('normal');
        setSearchTerm('');
        event.preventDefault();
        return;
      }
      if (event.key === 'Enter') {
        // Perform search
        if (searchTerm) {
          const selection = window.getSelection();
          selection?.removeAllRanges();
          const found = window.find(searchTerm, false, false, true);
          if (!found) {
            // Try from beginning
            window.find(searchTerm, false, false, false);
          }
        }
        setVimMode('normal');
        event.preventDefault();
        return;
      }
      if (event.key === 'Backspace') {
        setSearchTerm(prev => prev.slice(0, -1));
        event.preventDefault();
        return;
      }
      if (event.key.length === 1) {
        setSearchTerm(prev => prev + event.key);
        event.preventDefault();
        return;
      }
    }

    if (vimMode === 'normal') {
      event.preventDefault();
      
      switch (event.key) {
        case 'j':
          window.scrollBy(0, 100);
          break;
        case 'k':
          window.scrollBy(0, -100);
          break;
        case 'h':
          window.history.back();
          break;
        case 'l':
          window.history.forward();
          break;
        case 'g':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser shortcuts
          // Handle gg (go to top)
          const handleGG = (e: KeyboardEvent) => {
            if (e.key === 'g') {
              window.scrollTo(0, 0);
              window.removeEventListener('keydown', handleGG);
            } else {
              window.removeEventListener('keydown', handleGG);
            }
          };
          window.addEventListener('keydown', handleGG);
          break;
        case 'G':
          window.scrollTo(0, document.body.scrollHeight);
          break;
        case '/':
          setVimMode('search');
          setSearchTerm('');
          break;
        case '?':
          alert(`Vim mode commands:
j/k - scroll down/up
h/l - back/forward in history  
gg - go to top
G - go to bottom
/ - search
:q - quit vim mode
? - this help
Esc - cancel search`);
          break;
        case ':':
          // Handle vim commands like :q
          const handleCommand = (e: KeyboardEvent) => {
            if (e.key === 'q') {
              // Quit vim mode
              setVimModeEnabled(false);
              localStorage.setItem('vim-mode', 'false');
              window.dispatchEvent(new CustomEvent('vim-mode-changed', { 
                detail: { enabled: false } 
              }));
              window.removeEventListener('keydown', handleCommand);
            } else {
              window.removeEventListener('keydown', handleCommand);
            }
          };
          window.addEventListener('keydown', handleCommand);
          break;
      }
    }
  }, [vimModeEnabled, vimMode, searchTerm]);

  useEffect(() => {
    if (vimModeEnabled) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [vimModeEnabled, handleKeyPress]);

  return {
    vimModeEnabled,
    vimMode,
    searchTerm
  };
}