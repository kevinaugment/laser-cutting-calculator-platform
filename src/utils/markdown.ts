/**
 * Markdown Processing Utilities
 * Tools for converting between markdown and HTML, processing content
 */

import { ContentTOCItem } from '../types/content';

// Markdown processing options
export interface MarkdownOptions {
  enableSyntaxHighlighting?: boolean;
  enableMath?: boolean;
  enableTables?: boolean;
  enableTaskLists?: boolean;
  enableEmoji?: boolean;
  sanitizeHtml?: boolean;
  generateTOC?: boolean;
  baseUrl?: string;
}

// Default markdown processing options
export const DEFAULT_MARKDOWN_OPTIONS: MarkdownOptions = {
  enableSyntaxHighlighting: true,
  enableMath: false,
  enableTables: true,
  enableTaskLists: true,
  enableEmoji: true,
  sanitizeHtml: true,
  generateTOC: true,
};

/**
 * Convert markdown to HTML
 */
export function markdownToHtml(markdown: string, options: MarkdownOptions = {}): string {
  const opts = { ...DEFAULT_MARKDOWN_OPTIONS, ...options };
  
  // Basic markdown to HTML conversion
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
    })
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    
    // Lists
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Wrap in paragraphs
  html = `<p>${html}</p>`;
  
  // Clean up empty paragraphs and fix list formatting
  html = html
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<ul>.*<\/ul>)<\/p>/gs, '$1')
    .replace(/<p>(<ol>.*<\/ol>)<\/p>/gs, '$1')
    .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<pre>.*<\/pre>)<\/p>/gs, '$1');
  
  if (opts.enableTables) {
    html = processMarkdownTables(html);
  }
  
  if (opts.enableTaskLists) {
    html = processTaskLists(html);
  }
  
  if (opts.enableEmoji) {
    html = processEmoji(html);
  }
  
  if (opts.sanitizeHtml) {
    html = sanitizeHtml(html);
  }
  
  return html;
}

/**
 * Convert HTML back to markdown (basic implementation)
 */
export function htmlToMarkdown(html: string): string {
  return html
    // Headers
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n')
    .replace(/<h5>(.*?)<\/h5>/g, '##### $1\n\n')
    .replace(/<h6>(.*?)<\/h6>/g, '###### $1\n\n')
    
    // Bold and italic
    .replace(/<strong><em>(.*?)<\/em><\/strong>/g, '***$1***')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    
    // Code
    .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```\n\n')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    
    // Links and images
    .replace(/<a href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/g, '![$2]($1)')
    
    // Lists
    .replace(/<ul><li>(.*?)<\/li><\/ul>/gs, (match, content) => {
      return content.replace(/<\/li><li>/g, '\n* ').replace(/^/, '* ') + '\n\n';
    })
    .replace(/<ol><li>(.*?)<\/li><\/ol>/gs, (match, content) => {
      let counter = 1;
      return content.replace(/<\/li><li>/g, () => `\n${++counter}. `).replace(/^/, '1. ') + '\n\n';
    })
    
    // Paragraphs and line breaks
    .replace(/<p>(.*?)<\/p>/gs, '$1\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    
    // Clean up
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Generate table of contents from markdown
 */
export function generateTableOfContents(markdown: string): ContentTOCItem[] {
  const toc: ContentTOCItem[] = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      const anchor = generateAnchor(title);
      
      toc.push({
        id: anchor,
        title,
        level,
        anchor,
      });
    }
  }
  
  return buildTOCHierarchy(toc);
}

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Extract excerpt from content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags and markdown formatting
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }
  
  // Fall back to word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper functions

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function processMarkdownTables(html: string): string {
  // Basic table processing - would need more sophisticated implementation
  return html.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map(cell => cell.trim());
    return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
  });
}

function processTaskLists(html: string): string {
  return html
    .replace(/- \[ \] (.+)/g, '<input type="checkbox" disabled> $1')
    .replace(/- \[x\] (.+)/g, '<input type="checkbox" checked disabled> $1');
}

function processEmoji(html: string): string {
  // Basic emoji processing - would integrate with emoji library
  return html
    .replace(/:smile:/g, '😊')
    .replace(/:heart:/g, '❤️')
    .replace(/:thumbsup:/g, '👍');
}

function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - would use a proper sanitization library
  const allowedTags = ['p', 'br', 'strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'table', 'tr', 'td', 'th'];
  
  // This is a simplified implementation - use a proper sanitization library in production
  return html.replace(/<(\/?)([\w]+)[^>]*>/g, (match, slash, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });
}

function generateAnchor(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}

function buildTOCHierarchy(flatTOC: ContentTOCItem[]): ContentTOCItem[] {
  const result: ContentTOCItem[] = [];
  const stack: ContentTOCItem[] = [];
  
  for (const item of flatTOC) {
    // Remove items from stack that are at the same level or deeper
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      result.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }
    
    stack.push(item);
  }
  
  return result;
}
