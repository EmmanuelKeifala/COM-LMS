"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const wordLimit = 50;

  // Compute truncated content
  const truncatedContent = useMemo(() => {
    const words = value.split(' ');
    if (showFullContent || words.length <= wordLimit) {
      return value;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  }, [value, showFullContent]);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
     
      Placeholder.configure({
        placeholder: 'No content available...',
      }),
    ],
    content: truncatedContent,
    editable: false,
  });

  // Update editor content when truncatedContent changes
  useEffect(() => {
    if (editor && truncatedContent) {
      editor.commands.setContent(truncatedContent);
    }
  }, [truncatedContent, editor]);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-20 bg-slate-100 animate-pulse rounded-md" />;
  }

  return (
    <div className="prose prose-slate max-w-none">
      <div className="preview-content">
        <EditorContent editor={editor} />
      </div>

      {value.split(' ').length > wordLimit && (
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showFullContent ? 'Show less' : 'Show more'}
        </button>
      )}

      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror p {
          margin: 1em 0;
        }

        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          line-height: 1.1;
          font-weight: 700;
          margin-top: 2em;
          margin-bottom: 1em;
        }

        .ProseMirror pre {
          background: #0d0d0d;
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }

        .ProseMirror code {
          background: none;
          color: inherit;
          font-size: 0.8rem;
          padding: 0;
        }

        .ProseMirror blockquote {
          padding-left: 1rem;
          border-left: 2px solid #0d0d0d;
          margin-left: 0;
          margin-right: 0;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
        }

        .ProseMirror li > p,
        .ProseMirror li > div {
          margin: 0;
        }
      `}</style>
    </div>
  );
};