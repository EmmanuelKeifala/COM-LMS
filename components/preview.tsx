'use client';
import dynamic from 'next/dynamic';
import {useMemo, useState} from 'react';

import 'react-quill/dist/quill.bubble.css';

interface PreviewProps {
  value: string;
}

export const Preview = ({value}: PreviewProps) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const wordLimit = 50;

  const truncatedContent = useMemo(() => {
    const words = value.split(' ');
    if (showFullContent || words.length <= wordLimit) {
      return value;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  }, [value, showFullContent, wordLimit]);

  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), {ssr: false}),
    [],
  );

  return (
    <div>
      <ReactQuill theme="bubble" value={truncatedContent} readOnly />
      {value.split(' ').length > wordLimit && (
        <button onClick={() => setShowFullContent(!showFullContent)}>
          {showFullContent ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};
