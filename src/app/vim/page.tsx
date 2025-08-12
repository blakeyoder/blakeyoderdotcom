"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Vim() {
  const [vimMode, setVimMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('vim-mode') === 'true';
    setVimMode(savedMode);
  }, []);

  const toggleVimMode = () => {
    const newMode = !vimMode;
    setVimMode(newMode);
    localStorage.setItem('vim-mode', newMode.toString());
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('vim-mode-changed', { 
      detail: { enabled: newMode } 
    }));
  };

  return (
    <div className="container">
      <header>
        <h1>On Vim</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          <Link href="/">← Back to home</Link>
        </p>
      </header>

      <main>
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            I started using vim in 2008 during my first internship. A senior developer noticed me 
            struggling with basic text editing and said, &ldquo;Learn vim. It&rsquo;ll hurt for two weeks, 
            then you&rsquo;ll never want to use anything else.&rdquo;
          </p>
          
          <p style={{ marginBottom: '1.5rem' }}>
            He was right about both parts. Those first two weeks were miserable—accidentally 
            deleting paragraphs, getting stuck in insert mode, and hitting escape more times 
            than I care to count. But something clicked around week three.
          </p>
          
          <p style={{ marginBottom: '1.5rem' }}>
            Vim taught me to think about editing as a language. <code>ci&quot;</code> to change inside quotes. 
            <code>dap</code> to delete around paragraph. <code>:%s/old/new/g</code> to replace across a file. 
            These weren&rsquo;t just shortcuts—they were building blocks for expressing intent.
          </p>
          
          <p style={{ marginBottom: '1.5rem' }}>
            Fifteen years later, I still reach for vim bindings everywhere. In VSCode, in my browser, 
            even when writing emails. There&rsquo;s something deeply satisfying about never needing to 
            reach for a mouse to manipulate text.
          </p>
          
          <p style={{ marginBottom: '2rem' }}>
            My <a 
              href="https://github.com/blakeyoder/dotfiles/blob/main/.vimrc" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ borderBottom: '1px solid var(--text-tertiary)' }}
            >
              vimrc
            </a> has grown over the years, but the core philosophy remains: make the common case fast, 
            and make the complex case possible.
          </p>
        </div>

        <div style={{ 
          padding: '2rem', 
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          backgroundColor: 'var(--background)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Try vim mode on this site
          </h2>
          
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Enable vim keybindings to navigate this site. Use <code>j/k</code> to scroll, 
            <code>gg/G</code> to jump to top/bottom, <code>/</code> to search, and <code>:q</code> to quit vim mode.
          </p>
          
          <button
            onClick={toggleVimMode}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid var(--text-primary)',
              backgroundColor: vimMode ? 'var(--text-primary)' : 'transparent',
              color: vimMode ? 'var(--background)' : 'var(--text-primary)',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!vimMode) {
                (e.target as HTMLElement).style.backgroundColor = 'var(--text-primary)';
                (e.target as HTMLElement).style.color = 'var(--background)';
              }
            }}
            onMouseLeave={(e) => {
              if (!vimMode) {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
                (e.target as HTMLElement).style.color = 'var(--text-primary)';
              }
            }}
          >
            {vimMode ? 'Vim mode enabled ✓' : 'Enable vim mode'}
          </button>
          
          {vimMode && (
            <p style={{ 
              marginTop: '1rem', 
              fontSize: '0.9rem', 
              color: 'var(--text-tertiary)',
              fontStyle: 'italic' 
            }}>
              Vim mode is now active across the site. Press <code>?</code> for help.
            </p>
          )}
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <p>
            <strong>Supported commands:</strong> <code>j/k</code> (scroll), <code>gg/G</code> (top/bottom), 
            <code>h/l</code> (back/forward), <code>/</code> (search), <code>:q</code> (quit), <code>?</code> (help)
          </p>
        </div>
      </main>
    </div>
  );
}