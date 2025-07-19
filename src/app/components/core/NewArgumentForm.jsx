'use client';

import { useState } from 'react';

export default function NewArgumentForm({ onSubmit, disabled }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Argument content cannot be empty');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (err) {
      setError(err.message || 'Failed to post argument');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 border rounded bg-white dark:bg-zinc-800 mb-6">
      <textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
        placeholder="Write your argument here..."
        disabled={disabled}
      />
      {error && <p className="text-red-600 my-2">{error}</p>}
      <button
        type="submit"
        disabled={loading || disabled}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Post Argument'}
      </button>
    </form>
  );
}
