import React, { useRef, useEffect } from 'react';
import { Bold, Italic, List, Type } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, rows = 3 }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text/plain');
    
    // Insert plain text and apply document's default font size
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      // Create a text node with the pasted content
      const textNode = document.createTextNode(paste);
      range.insertNode(textNode);
      
      // Move cursor to end of inserted text
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Fallback: append to end
      if (editorRef.current) {
        const textNode = document.createTextNode(paste);
        editorRef.current.appendChild(textNode);
      }
    }
    
    handleInput();
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };


  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Numbered List"
        >
          <Type size={16} />
        </button>
      </div>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        className="p-3 min-h-[80px] focus:outline-none"
        style={{
          minHeight: `${rows * 24}px`,
          fontSize: `${settings.fontSize.body}pt`,
          color: '#000000',
          fontFamily: settings.fontFamily,
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin-left: 20px;
          margin-top: 4px;
        }
        [contenteditable] li {
          margin-bottom: 2px;
        }
        [contenteditable] * {
          font-size: ${settings.fontSize.body}pt !important;
          color: #000000 !important;
        }
        [contenteditable] strong, [contenteditable] b {
          font-weight: bold;
        }
        [contenteditable] em, [contenteditable] i {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

