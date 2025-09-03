/**
 * Rich Text Editor Component
 * WYSIWYG editor with markdown support for content management
 */

import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useTheme } from '../../theme';
import { markdownToHtml, htmlToMarkdown } from '../../utils/markdown';

export interface RichTextEditorProps {
  content: string;
  contentMarkdown: string;
  onContentChange: (html: string, markdown: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  showToolbar?: boolean;
  mode?: 'wysiwyg' | 'markdown' | 'preview';
  onModeChange?: (mode: 'wysiwyg' | 'markdown' | 'preview') => void;
}

export function RichTextEditor({
  content,
  contentMarkdown,
  onContentChange,
  placeholder = 'Start writing...',
  editable = true,
  className = '',
  showToolbar = true,
  mode = 'wysiwyg',
  onModeChange,
}: RichTextEditorProps) {
  const { theme } = useTheme();

  // Initialize editor with extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 hover:text-primary-800 underline',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onContentChange(html, markdown);
    },
  });

  // Update editor content when props change
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  // Handle mode changes
  const handleModeChange = useCallback((newMode: 'wysiwyg' | 'markdown' | 'preview') => {
    if (onModeChange) {
      onModeChange(newMode);
    }
  }, [onModeChange]);

  // Toolbar actions
  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor?.chain().focus().toggleCode().run();
  }, [editor]);

  const setHeading = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  const setParagraph = useCallback(() => {
    editor?.chain().focus().setParagraph().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  // Render markdown mode
  if (mode === 'markdown') {
    return (
      <div className={`rich-text-editor markdown-mode ${className}`}>
        {showToolbar && (
          <EditorToolbar
            mode={mode}
            onModeChange={handleModeChange}
            showModeToggle={!!onModeChange}
          />
        )}
        <textarea
          value={contentMarkdown}
          onChange={(e) => {
            const markdown = e.target.value;
            const html = markdownToHtml(markdown);
            onContentChange(html, markdown);
          }}
          placeholder={placeholder}
          className="w-full h-96 p-4 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          style={{
            backgroundColor: 'var(--color-neutral-50)',
            borderColor: 'var(--color-neutral-300)',
            color: 'var(--color-neutral-700)',
          }}
        />
      </div>
    );
  }

  // Render preview mode
  if (mode === 'preview') {
    return (
      <div className={`rich-text-editor preview-mode ${className}`}>
        {showToolbar && (
          <EditorToolbar
            mode={mode}
            onModeChange={handleModeChange}
            showModeToggle={!!onModeChange}
          />
        )}
        <div
          className="prose prose-lg max-w-none p-4 border rounded-md min-h-96"
          style={{
            backgroundColor: 'var(--color-neutral-50)',
            borderColor: 'var(--color-neutral-300)',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }

  // Render WYSIWYG mode
  return (
    <div className={`rich-text-editor wysiwyg-mode ${className}`}>
      {showToolbar && (
        <EditorToolbar
          mode={mode}
          onModeChange={handleModeChange}
          showModeToggle={!!onModeChange}
          editor={editor}
          onBold={toggleBold}
          onItalic={toggleItalic}
          onStrike={toggleStrike}
          onCode={toggleCode}
          onHeading={setHeading}
          onParagraph={setParagraph}
          onBulletList={toggleBulletList}
          onOrderedList={toggleOrderedList}
          onBlockquote={toggleBlockquote}
          onCodeBlock={toggleCodeBlock}
          onImage={addImage}
          onLink={addLink}
          onTable={insertTable}
        />
      )}
      <div
        className="editor-content border rounded-md min-h-96"
        style={{
          backgroundColor: 'var(--color-neutral-50)',
          borderColor: 'var(--color-neutral-300)',
        }}
      >
        <EditorContent
          editor={editor}
          className="prose prose-lg max-w-none p-4 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-96"
        />
      </div>
    </div>
  );
}

// Editor Toolbar Component
interface EditorToolbarProps {
  mode: 'wysiwyg' | 'markdown' | 'preview';
  onModeChange?: (mode: 'wysiwyg' | 'markdown' | 'preview') => void;
  showModeToggle?: boolean;
  editor?: any;
  onBold?: () => void;
  onItalic?: () => void;
  onStrike?: () => void;
  onCode?: () => void;
  onHeading?: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  onParagraph?: () => void;
  onBulletList?: () => void;
  onOrderedList?: () => void;
  onBlockquote?: () => void;
  onCodeBlock?: () => void;
  onImage?: () => void;
  onLink?: () => void;
  onTable?: () => void;
}

function EditorToolbar({
  mode,
  onModeChange,
  showModeToggle = false,
  editor,
  onBold,
  onItalic,
  onStrike,
  onCode,
  onHeading,
  onParagraph,
  onBulletList,
  onOrderedList,
  onBlockquote,
  onCodeBlock,
  onImage,
  onLink,
  onTable,
}: EditorToolbarProps) {
  return (
    <div
      className="flex items-center gap-1 p-2 border-b bg-gray-50"
      style={{
        backgroundColor: 'var(--color-neutral-100)',
        borderColor: 'var(--color-neutral-300)',
      }}
    >
      {/* Mode Toggle */}
      {showModeToggle && onModeChange && (
        <div className="flex items-center gap-1 mr-4 border-r pr-4">
          <button
            onClick={() => onModeChange('wysiwyg')}
            className={`px-2 py-1 text-xs rounded ${
              mode === 'wysiwyg' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => onModeChange('markdown')}
            className={`px-2 py-1 text-xs rounded ${
              mode === 'markdown' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Markdown
          </button>
          <button
            onClick={() => onModeChange('preview')}
            className={`px-2 py-1 text-xs rounded ${
              mode === 'preview' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Preview
          </button>
        </div>
      )}

      {/* WYSIWYG Toolbar */}
      {mode === 'wysiwyg' && editor && (
        <>
          {/* Text Formatting */}
          <div className="flex items-center gap-1 mr-2">
            <ToolbarButton
              onClick={onBold}
              active={editor.isActive('bold')}
              title="Bold"
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              onClick={onItalic}
              active={editor.isActive('italic')}
              title="Italic"
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              onClick={onStrike}
              active={editor.isActive('strike')}
              title="Strikethrough"
            >
              <s>S</s>
            </ToolbarButton>
            <ToolbarButton
              onClick={onCode}
              active={editor.isActive('code')}
              title="Inline Code"
            >
              {'</>'}
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 mr-2 border-l pl-2">
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'paragraph') {
                  onParagraph?.();
                } else {
                  const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
                  onHeading?.(level);
                }
              }}
              value={
                editor.isActive('heading', { level: 1 }) ? '1' :
                editor.isActive('heading', { level: 2 }) ? '2' :
                editor.isActive('heading', { level: 3 }) ? '3' :
                editor.isActive('heading', { level: 4 }) ? '4' :
                editor.isActive('heading', { level: 5 }) ? '5' :
                editor.isActive('heading', { level: 6 }) ? '6' :
                'paragraph'
              }
              className="text-xs border rounded px-2 py-1"
            >
              <option value="paragraph">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>
          </div>

          {/* Lists and Blocks */}
          <div className="flex items-center gap-1 mr-2 border-l pl-2">
            <ToolbarButton
              onClick={onBulletList}
              active={editor.isActive('bulletList')}
              title="Bullet List"
            >
              •
            </ToolbarButton>
            <ToolbarButton
              onClick={onOrderedList}
              active={editor.isActive('orderedList')}
              title="Numbered List"
            >
              1.
            </ToolbarButton>
            <ToolbarButton
              onClick={onBlockquote}
              active={editor.isActive('blockquote')}
              title="Quote"
            >
              "
            </ToolbarButton>
            <ToolbarButton
              onClick={onCodeBlock}
              active={editor.isActive('codeBlock')}
              title="Code Block"
            >
              {'{}'}
            </ToolbarButton>
          </div>

          {/* Media and Links */}
          <div className="flex items-center gap-1 border-l pl-2">
            <ToolbarButton
              onClick={onImage}
              title="Insert Image"
            >
              🖼️
            </ToolbarButton>
            <ToolbarButton
              onClick={onLink}
              active={editor.isActive('link')}
              title="Insert Link"
            >
              🔗
            </ToolbarButton>
            <ToolbarButton
              onClick={onTable}
              active={editor.isActive('table')}
              title="Insert Table"
            >
              ⊞
            </ToolbarButton>
          </div>
        </>
      )}
    </div>
  );
}

// Toolbar Button Component
interface ToolbarButtonProps {
  onClick?: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active = false, title, children }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 text-sm rounded hover:bg-gray-200 transition-colors ${
        active ? 'bg-primary-100 text-primary-700' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  );
}
