/**
 * RichTextEditor Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '../../../theme';
import { RichTextEditor } from '../../../components/cms/RichTextEditor';

// Mock TipTap editor
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => ({
    getHTML: vi.fn(() => '<p>Test content</p>'),
    commands: {
      setContent: vi.fn(),
      focus: vi.fn(() => ({ toggleBold: vi.fn(() => ({ run: vi.fn() })) })),
    },
    isActive: vi.fn(() => false),
    chain: vi.fn(() => ({
      focus: vi.fn(() => ({
        toggleBold: vi.fn(() => ({ run: vi.fn() })),
        toggleItalic: vi.fn(() => ({ run: vi.fn() })),
        toggleStrike: vi.fn(() => ({ run: vi.fn() })),
        toggleCode: vi.fn(() => ({ run: vi.fn() })),
        toggleHeading: vi.fn(() => ({ run: vi.fn() })),
        setParagraph: vi.fn(() => ({ run: vi.fn() })),
        toggleBulletList: vi.fn(() => ({ run: vi.fn() })),
        toggleOrderedList: vi.fn(() => ({ run: vi.fn() })),
        toggleBlockquote: vi.fn(() => ({ run: vi.fn() })),
        toggleCodeBlock: vi.fn(() => ({ run: vi.fn() })),
        setImage: vi.fn(() => ({ run: vi.fn() })),
        setLink: vi.fn(() => ({ run: vi.fn() })),
        insertTable: vi.fn(() => ({ run: vi.fn() })),
      })),
    })),
  })),
  EditorContent: ({ editor, className }: any) => (
    <div className={className} data-testid="editor-content">
      Editor Content
    </div>
  ),
}));

// Mock TipTap extensions
vi.mock('@tiptap/starter-kit', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-image', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-link', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-table', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-table-row', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-table-cell', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-table-header', () => ({
  default: {},
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('RichTextEditor', () => {
  const mockOnContentChange = vi.fn();

  beforeEach(() => {
    mockOnContentChange.mockClear();
  });

  it('renders WYSIWYG editor by default', () => {
    const mockOnModeChange = vi.fn();

    render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          onModeChange={mockOnModeChange}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.getByText('Visual')).toBeInTheDocument();
  });

  it('switches to markdown mode', () => {
    const mockOnModeChange = vi.fn();

    render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          onModeChange={mockOnModeChange}
          mode="markdown"
        />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();
    expect(screen.getByText('Markdown')).toBeInTheDocument();
  });

  it('switches to preview mode', () => {
    const mockOnModeChange = vi.fn();

    render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          onModeChange={mockOnModeChange}
          mode="preview"
        />
      </TestWrapper>
    );

    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('handles mode changes', () => {
    const mockOnModeChange = vi.fn();
    
    render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          onModeChange={mockOnModeChange}
        />
      </TestWrapper>
    );

    const markdownButton = screen.getByText('Markdown');
    fireEvent.click(markdownButton);

    expect(mockOnModeChange).toHaveBeenCalledWith('markdown');
  });

  it('handles content changes in markdown mode', () => {
    render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          mode="markdown"
        />
      </TestWrapper>
    );

    const textarea = screen.getByDisplayValue('Test content');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(mockOnContentChange).toHaveBeenCalled();
  });

  it('shows toolbar when enabled', () => {
    const mockOnModeChange = vi.fn();

    render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          onModeChange={mockOnModeChange}
          showToolbar={true}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Visual')).toBeInTheDocument();
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
  });

  it('hides toolbar when disabled', () => {
    render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          showToolbar={false}
        />
      </TestWrapper>
    );

    expect(screen.queryByText('Visual')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Bold')).not.toBeInTheDocument();
  });

  it('handles placeholder text', () => {
    render(
      <TestWrapper>
        <RichTextEditor
          content=""
          contentMarkdown=""
          onContentChange={mockOnContentChange}
          placeholder="Custom placeholder"
          mode="markdown"
        />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('handles editable state', () => {
    render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          editable={false}
          mode="markdown"
        />
      </TestWrapper>
    );

    const textarea = screen.getByDisplayValue('Test content');
    expect(textarea).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <RichTextEditor
          content="<p>Test content</p>"
          contentMarkdown="Test content"
          onContentChange={mockOnContentChange}
          className="custom-editor"
        />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-editor')).toBeInTheDocument();
  });
});
