import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

export default function Editor({ value, onChange }) {
  const { quill, quillRef } = useQuill();

  // Listen for edits
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const htmlContent = quill.root.innerHTML;
        onChange?.(htmlContent);
      });
    }
  }, [quill, onChange]);

  // Always update editor when parent `value` changes
  useEffect(() => {
    if (quill && value != null) {
      const currentContent = quill.root.innerHTML;
      if (value !== currentContent) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [quill, value]);

  return (
    <div className="p-4">
      <div ref={quillRef} style={{ height: 300 }} className="mb-4" />
    </div>
  );
}
