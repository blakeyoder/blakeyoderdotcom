"use client";

import { useVimMode } from '../hooks/useVimMode';

export default function VimStatusBar() {
  const { vimModeEnabled, vimMode, searchTerm } = useVimMode();

  if (!vimModeEnabled) return null;

  const getCurrentPage = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      switch (path) {
        case '/': return '~/index.tsx';
        case '/about': return '~/about/page.tsx';
        case '/writing': return '~/writing/page.tsx';
        case '/bookmarks': return '~/bookmarks/page.tsx';
        case '/vim': return '~/vim/page.tsx';
        default: return `~${path}/page.tsx`;
      }
    }
    return '~/page.tsx';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--text-primary)',
      color: 'var(--background)',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontFamily: 'Monaco, "SF Mono", Consolas, monospace',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      borderTop: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ 
          backgroundColor: vimMode === 'normal' ? 'var(--background)' : 'transparent',
          color: vimMode === 'normal' ? 'var(--text-primary)' : 'var(--background)',
          padding: '0.25rem 0.5rem',
          borderRadius: '2px',
          fontWeight: 'bold'
        }}>
          {vimMode === 'normal' ? 'NORMAL' : 'SEARCH'}
        </span>
        
        {vimMode === 'search' && (
          <span>
            /{searchTerm}<span style={{ opacity: 0.7 }}>_</span>
          </span>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>{getCurrentPage()}</span>
        <span style={{ opacity: 0.7 }}>
          {typeof window !== 'undefined' && `${Math.round(window.scrollY)}px`}
        </span>
      </div>
    </div>
  );
}