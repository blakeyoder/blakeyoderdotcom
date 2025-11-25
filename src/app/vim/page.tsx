"use client";

import Link from "next/link";
import { useState, useRef } from "react";

type VimMode = 'normal' | 'insert' | 'visual' | 'command';

const initialPageContent = `On Vim

I first picked up Vim in 2016 while working at fictivekin.com. One day, I quit Sublime Text cold turkey and dove straight into vim. For the first two weeks, it felt like coding with one arm tied behind my back—every keystroke was friction, every task took twice as long.

Then, around week three, something clicked. The motions stopped feeling foreign, and I started to see patterns: Vim wasn't just a text editor, it was a language. Key bindings were verbs and modifiers, each combining into concise ways of expressing intent.

Almost ten years later, that way of thinking is second nature. I use Vim bindings everywhere, and with the rise of agentic coding tools, the payoff has only grown. A tool like Claude Code in the terminal feels like it was made for this—fast, fluid, and effortless in a way I could only dream of back in those first awkward weeks.

If you want to learn the dialect I speak, my .vimrc is right here for you to borrow, steal, or adapt. Not ready to go all-in? You can still hop into Vim mode on this site and try some of my favorite keybindings here—no commitment.

Ready to start? Click "Enter Vim Mode" below and follow the guided tutorial.`;

export default function Vim() {
  const [vimModeActive, setVimModeActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentMode, setCurrentMode] = useState<VimMode>('normal');
  const [pageContent, setPageContent] = useState(initialPageContent);
  const [commandBuffer, setCommandBuffer] = useState('');
  const [statusMessage, setStatusMessage] = useState('-- NORMAL --');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const enterVimMode = () => {
    setVimModeActive(true);
    setTutorialStep(0);
    // Focus the editor
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  };

  const exitVimMode = () => {
    setVimModeActive(false);
    setCurrentMode('normal');
    setTutorialStep(0);
    setPageContent(initialPageContent);
  };

  const tutorialSteps = [
    {
      title: "Welcome to Vim Mode",
      content: "You're now in vim mode! This entire page has become your vim editor. Notice the status bar at the bottom showing you're in NORMAL mode.",
      task: "Look around - you can see the cursor and status bar. Click 'Next' when ready.",
      completedBy: "manual"
    },
    {
      title: "Insert Mode",
      content: "Press 'i' to enter INSERT mode. You can then type anywhere in this text. The status bar will change to show INSERT mode.",
      task: "Press 'i', type something, then press 'jj' (my custom binding) to return to normal mode.",
      completedBy: "mode_change"
    },
    {
      title: "Navigation",
      content: "Use 'h', 'j', 'k', 'l' to move left, down, up, right. Try moving around this text!",
      task: "Navigate around using hjkl keys. Try going to different lines and characters.",
      completedBy: "manual"
    },
    {
      title: "My Custom Save",
      content: "I use Space as my leader key. Try 'Space + w' to save. You'll see a message in the status bar.",
      task: "Press Space, then 'w' to trigger my custom save command.",
      completedBy: "save_command"
    },
    {
      title: "Line Operations",
      content: "Try 'dd' to delete an entire line, or 'x' to delete a single character. These only work in normal mode!",
      task: "Delete some text using 'dd' or 'x'. Watch how the text changes.",
      completedBy: "manual"
    },
    {
      title: "End of Line Jump",
      content: "Try my custom 'Space + 4' to jump to the end of the current line. Much faster than holding the right arrow!",
      task: "Press Space, then '4' to jump to the end of a line.",
      completedBy: "end_of_line"
    },
    {
      title: "Free Practice",
      content: "You've learned the basics! Practice editing this text. Try different combinations of commands. Press 'Finish' when you're done.",
      task: "Experiment with vim commands. The text will reset when you finish.",
      completedBy: "manual"
    }
  ];

  const nextStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      exitVimMode();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!vimModeActive || !editorRef.current) return;

    const textarea = editorRef.current;
    const content = pageContent;
    const position = textarea.selectionStart || 0;

    // Handle jj to escape (my custom binding)
    if (currentMode === 'insert' && e.key === 'j' && commandBuffer === 'j') {
      e.preventDefault();
      setCurrentMode('normal');
      setStatusMessage('-- NORMAL --');
      setCommandBuffer('');
      
      // Check if this completes the insert mode tutorial step
      if (tutorialStep === 1 && tutorialSteps[1].completedBy === 'mode_change') {
        setTimeout(nextStep, 1000);
      }
      return;
    }

    if (currentMode === 'insert') {
      if (e.key === 'j') {
        setCommandBuffer('j');
        return;
      } else {
        setCommandBuffer('');
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        setCurrentMode('normal');
        setStatusMessage('-- NORMAL --');
        if (tutorialStep === 1 && tutorialSteps[1].completedBy === 'mode_change') {
          setTimeout(nextStep, 1000);
        }
        return;
      }
      
      // Let normal typing happen in insert mode
      return;
    }

    // Normal mode commands
    e.preventDefault();
    
    if (currentMode === 'command') {
      if (e.key === 'Enter') {
        if (commandBuffer === 'q') {
          exitVimMode();
        } else if (commandBuffer.startsWith('w')) {
          setStatusMessage('"vim-tutorial" saved!');
        }
        setCommandBuffer('');
        setCurrentMode('normal');
        setStatusMessage('-- NORMAL --');
        return;
      } else if (e.key === 'Escape') {
        setCommandBuffer('');
        setCurrentMode('normal');
        setStatusMessage('-- NORMAL --');
        return;
      } else if (e.key === 'Backspace') {
        setCommandBuffer(prev => prev.slice(0, -1));
        return;
      } else {
        setCommandBuffer(prev => prev + e.key);
        return;
      }
    }

    // Normal mode key handling
    switch (e.key) {
      case 'i':
        setCurrentMode('insert');
        setStatusMessage('-- INSERT --');
        break;
        
      case ':':
        setCurrentMode('command');
        setCommandBuffer('');
        setStatusMessage(':');
        break;
        
      case '/':
        setStatusMessage('Search not implemented in this demo');
        break;
        
      case 'x':
        if (position < content.length) {
          const newContent = content.slice(0, position) + content.slice(position + 1);
          setPageContent(newContent);
          setTimeout(() => textarea.setSelectionRange(position, position), 0);
        }
        break;
        
      case 'd':
        if (commandBuffer === 'd') {
          // Delete line
          const lines = content.split('\n');
          const beforeCursor = content.slice(0, position);
          const currentLineIndex = beforeCursor.split('\n').length - 1;
          
          if (lines.length > 1) {
            lines.splice(currentLineIndex, 1);
            const newContent = lines.join('\n');
            setPageContent(newContent);
            setStatusMessage('Line deleted');
          }
          setCommandBuffer('');
        } else {
          setCommandBuffer('d');
        }
        break;
        
      case ' ':
        // My leader key
        if (commandBuffer === ' ') {
          setCommandBuffer(' ');
        } else {
          setCommandBuffer(' ');
        }
        break;
        
      case 'w':
        if (commandBuffer === ' ') {
          // My Space + w save
          setStatusMessage('"vim-tutorial" saved!');
          setCommandBuffer('');
          
          // Check if this completes the save tutorial step
          if (tutorialStep === 3 && tutorialSteps[3].completedBy === 'save_command') {
            setTimeout(nextStep, 1500);
          }
        }
        break;
        
      case '4':
        if (commandBuffer === ' ') {
          // My Space + 4 end of line
          const lines = content.split('\n');
          const beforeCursor = content.slice(0, position);
          const currentLineIndex = beforeCursor.split('\n').length - 1;
          const currentLineStart = content.indexOf(lines[currentLineIndex], position - beforeCursor.split('\n')[currentLineIndex].length);
          const newPosition = currentLineStart + lines[currentLineIndex].length;
          setTimeout(() => textarea.setSelectionRange(newPosition, newPosition), 0);
          setCommandBuffer('');
          
          // Check if this completes the end of line tutorial step
          if (tutorialStep === 5 && tutorialSteps[5].completedBy === 'end_of_line') {
            setTimeout(nextStep, 1000);
          }
        }
        break;
        
      case 'h':
        if (commandBuffer !== ' ') {
          const newPos = Math.max(0, position - 1);
          setTimeout(() => textarea.setSelectionRange(newPos, newPos), 0);
        }
        break;
        
      case 'l':
        if (commandBuffer !== ' ') {
          const newPos = Math.min(content.length, position + 1);
          setTimeout(() => textarea.setSelectionRange(newPos, newPos), 0);
        }
        break;
        
      case 'j':
        if (commandBuffer !== ' ') {
          // Move down a line
          const lines = content.split('\n');
          const beforeCursor = content.slice(0, position);
          const currentLineIndex = beforeCursor.split('\n').length - 1;
          const currentLineStart = beforeCursor.lastIndexOf('\n') + 1;
          const columnPosition = position - currentLineStart;
          
          if (currentLineIndex < lines.length - 1) {
            const nextLineStart = content.indexOf('\n', position) + 1;
            const nextLineEnd = content.indexOf('\n', nextLineStart);
            const nextLineLength = nextLineEnd === -1 ? content.length - nextLineStart : nextLineEnd - nextLineStart;
            const newPosition = nextLineStart + Math.min(columnPosition, nextLineLength);
            setTimeout(() => textarea.setSelectionRange(newPosition, newPosition), 0);
          }
        }
        break;
        
      case 'k':
        if (commandBuffer !== ' ') {
          // Move up a line
          const beforeCursor = content.slice(0, position);
          const currentLineStart = beforeCursor.lastIndexOf('\n') + 1;
          const columnPosition = position - currentLineStart;
          const previousLineEnd = beforeCursor.lastIndexOf('\n', currentLineStart - 2);
          
          if (previousLineEnd >= 0) {
            const previousLineStart = content.lastIndexOf('\n', previousLineEnd - 1) + 1;
            const previousLineLength = previousLineEnd - previousLineStart;
            const newPosition = previousLineStart + Math.min(columnPosition, previousLineLength);
            setTimeout(() => textarea.setSelectionRange(newPosition, newPosition), 0);
          } else if (currentLineStart > 0) {
            // First line case
            const newPosition = Math.min(columnPosition, currentLineStart - 1);
            setTimeout(() => textarea.setSelectionRange(newPosition, newPosition), 0);
          }
        }
        break;
        
      default:
        setCommandBuffer('');
        break;
    }
  };

  if (vimModeActive) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--background)',
        zIndex: 1000
      }}>
        {/* Tutorial Status Bar */}
        <div style={{
          padding: '1rem 2rem',
          backgroundColor: 'var(--text-primary)',
          color: 'var(--background)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.95rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div>
              <strong>Step {tutorialStep + 1} of {tutorialSteps.length}:</strong> {tutorialSteps[tutorialStep].title}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {tutorialSteps[tutorialStep].content}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {tutorialStep > 0 && (
              <button
                onClick={() => setTutorialStep(tutorialStep - 1)}
                style={{
                  padding: '0.4rem 0.8rem',
                  border: `1px solid var(--background)`,
                  backgroundColor: 'transparent',
                  color: 'var(--background)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                ← Prev
              </button>
            )}
            
            {tutorialSteps[tutorialStep].completedBy === 'manual' && (
              <button
                onClick={nextStep}
                style={{
                  padding: '0.4rem 0.8rem',
                  border: `1px solid var(--background)`,
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next →'}
              </button>
            )}
            
            {tutorialSteps[tutorialStep].completedBy !== 'manual' && (
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                Complete task to continue
              </span>
            )}
            
            <button
              onClick={exitVimMode}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: 'var(--background)',
                padding: '0 0.5rem',
                opacity: 0.8
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Task Instruction Bar */}
        <div style={{
          padding: '0.75rem 2rem',
          backgroundColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <strong>Your task:</strong> {tutorialSteps[tutorialStep].task}
        </div>

        {/* Main Editor */}
        <div style={{ height: 'calc(100% - 120px)', display: 'flex', flexDirection: 'column' }}>
          {/* File Header Bar */}
          <div style={{
            padding: '0.75rem 2rem',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--background)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem'
          }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>vim-tutorial</span>
              <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
                {pageContent.split('\n').length} lines
              </span>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Tutorial: {Math.round((tutorialStep / (tutorialSteps.length - 1)) * 100)}% complete
            </div>
          </div>

          {/* Editor */}
          <textarea
            ref={editorRef}
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              padding: '2rem',
              border: 'none',
              backgroundColor: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'Crimson Text, serif',
              lineHeight: '1.618',
              resize: 'none',
              outline: 'none'
            }}
            autoFocus
          />

          {/* Vim Status Bar */}
          <div style={{
            padding: '0.75rem 2rem',
            backgroundColor: currentMode === 'insert' ? '#2a4d3a' : 
                           currentMode === 'command' ? '#4a3d2a' : '#2a2a2a',
            color: 'white',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span>
                {currentMode === 'command' ? `:${commandBuffer}` : statusMessage}
              </span>
              {commandBuffer && currentMode !== 'command' && (
                <span style={{ marginLeft: '1rem', opacity: 0.7 }}>
                  ({commandBuffer})
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span>{currentMode.toUpperCase()}</span>
              <span>jj→NORMAL | Space+w→Save | :q→Quit</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: "2rem" }}>
        <p className="small-caps" style={{ marginBottom: "0.75rem" }}>
          <Link href="/" className="nav-link">Blake Yoder</Link>
        </p>
        <h1>On Vim</h1>
      </header>

      <hr className="rule-thick" />

      <main>
        <section style={{ marginBottom: "3rem" }}>
          <p>
            I first picked up Vim in 2016 while working at <a
              href="https://fictivekin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              fictivekin.com
            </a>. One day, I quit Sublime Text
            cold turkey and dove straight into vim. For the first two weeks, it felt like coding with one
            arm tied behind my back—every keystroke was friction, every task took twice as long.
          </p>

          <p>
            Then, around week three, something clicked. The motions stopped feeling foreign, and I started
            to see patterns: Vim wasn&apos;t just a text editor, it was a language. Key bindings were verbs
            and modifiers, each combining into concise ways of expressing intent.
          </p>

          <p>
            Almost ten years later, that way of thinking is second nature. I use Vim bindings everywhere,
            and with the rise of agentic coding tools, the payoff has only grown. A tool like <a
              href="https://github.com/anthropics/claude-code"
              target="_blank"
              rel="noopener noreferrer"
            >
              Claude Code
            </a> in the terminal feels like it was made for this—fast, fluid, and effortless in a way I could
            only dream of back in those first awkward weeks.
          </p>

          <p>
            If you want to learn the dialect I speak, my <a
              href="https://raw.githubusercontent.com/blakeyoder/dotfiles/refs/heads/master/.vimrc"
              target="_blank"
              rel="noopener noreferrer"
            >
              .vimrc
            </a> is right here for you to borrow, steal, or adapt. Not ready to go all-in? You can still
            hop into Vim mode on this site and try some of my favorite keybindings here—no commitment.
          </p>
        </section>

        <div style={{
          padding: "2rem",
          border: "2px solid var(--ink)",
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
            Ready to try vim?
          </h2>

          <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
            This entire page will become your vim editor. You&apos;ll get step-by-step guidance
            through persistent status bars at the top as you learn my custom keybindings.
          </p>

          <button
            onClick={enterVimMode}
            className="btn"
          >
            Enter Vim Mode
          </button>

          <p style={{
            marginTop: "1rem",
            fontSize: "0.875rem",
            color: "var(--text-tertiary)",
            fontStyle: "italic"
          }}>
            Don&apos;t worry—you can exit anytime with <code className="mono">:q</code> or the × button
          </p>
        </div>
      </main>
    </div>
  );
}
