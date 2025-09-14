'use client';

import React, { useState, useRef } from 'react';
import { authAPI } from '@/services/authAPI';
import { ImageService } from '@/services/imageService';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  showPreview?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your story...',
  height = '400px',
  showPreview = true
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Text formatting functions
  const formatText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = value.substring(0, start) + text + value.substring(end);
    onChange(newText);
    
    // Set cursor after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);

          // Get auth token
          const token = authAPI.getToken();
          const headers: HeadersInit = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch('/api/stories/upload-image', {
            method: 'POST',
            headers: headers,
            body: formData,
          });

          const data = await response.json();
          
          if (data.success) {
            const imageMarkdown = `\n![Image](${data.imageUrl})\n`;
            insertText(imageMarkdown);
          } else {
            alert('Failed to upload image: ' + (data.error || data.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image: Network error');
        }
      }
    };
    
    input.click();
  };

  // Convert HTML to markdown when pasting rich content
  const htmlToMarkdown = (html: string): string => {
    return html
      // Headers
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n')
      // Bold and italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Images
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
      .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, '![$1]($2)')
      .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![Image]($1)')
      // Lists
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
      // Paragraphs and line breaks
      .replace(/<p[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<div[^>]*>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      // Code blocks
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      // Remove remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      .trim();
  };

  // Handle paste event to convert HTML to markdown
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');
    
    let pastedContent = '';
    
    if (htmlData && htmlData.trim()) {
      // Convert HTML to markdown
      pastedContent = htmlToMarkdown(htmlData);
    } else if (textData) {
      // Use plain text as fallback
      pastedContent = textData;
    }
    
    if (pastedContent) {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const newText = value.substring(0, start) + pastedContent + value.substring(end);
        onChange(newText);
        
        // Set cursor after pasted content
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + pastedContent.length, start + pastedContent.length);
        }, 0);
      }
    }
  };

  // Convert markdown-like syntax to HTML for preview
  const markdownToHtml = (text: string) => {
    let html = text
      // Headers (support H1-H6)
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^• (.*$)/gm, '<li>$1</li>')
      // Images - convert relative URLs to absolute URLs using ImageService
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        // Use ImageService to get the proper image URL
        const fullSrc = src.startsWith('/images') 
          ? ImageService.getImageUrl(src.replace('/images/', ''), 'stories/content')
          : src;
        return `<img src="${fullSrc}" alt="${alt}" style="max-width: 100%; height: auto; margin: 1rem auto; display: block; border-radius: 8px;" />`;
      })
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');
    
    // Wrap lists in ul tags
    html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
    
    return `<p>${html}</p>`;
  };

  // Create HTML for preview
  const createMarkup = () => {
    return { __html: markdownToHtml(value) };
  };

  return (
    <div className="space-y-4">
      {showPreview && (
        <div className="flex space-x-1 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'editor'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
        </div>
      )}

      {activeTab === 'editor' ? (
        <div className="space-y-2">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-300 rounded-t-lg">
            <button
              type="button"
              onClick={() => formatText('**', '**')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => formatText('*', '*')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Italic"
            >
              <em>I</em>
            </button>
            <div className="border-l border-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => insertText('\n# ')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => insertText('\n## ')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertText('\n### ')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Heading 3"
            >
              H3
            </button>
            <div className="border-l border-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={handleImageUpload}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Insert Image"
            >
              📷 Image
            </button>
          </div>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            style={{ height }}
          />
          
          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <p><strong>Formatting Tips:</strong></p>
            <p>• **bold text** or *italic text*</p>
            <p>• # Heading 1, ## Heading 2, ### Heading 3</p>
            <p>• Use the Image button to upload and insert images</p>
            <p>• 📋 <strong>Copy & Paste:</strong> Paste from ChatGPT, Word, or any rich text - formatting will be converted automatically!</p>
          </div>
        </div>
      ) : (
        <div 
          className="prose prose-lg max-w-none p-4 border border-gray-300 rounded-lg bg-gray-50"
          style={{ minHeight: height }}
        >
          <div 
            className="rich-text-preview"
            dangerouslySetInnerHTML={createMarkup()}
          />
        </div>
      )}

      {/* Character counter */}
      <div className="text-sm text-gray-500">
        Characters: {value.length} | Words: {value.trim().split(/\s+/).filter(word => word.length > 0).length}
      </div>
    </div>
  );
};

export default RichTextEditor;
