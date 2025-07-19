'use client';

import { useState } from 'react';

export default function JoinDebate({ debateId, onJoin }) {
  const [side, setSide] = useState('SUPPORT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setLoading(true);
    setError('');
    try {
      await onJoin(side);
    } catch (err) {
      setError(err.message || 'Failed to join debate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white dark:bg-zinc-800 max-w-md mx-auto mb-6">
      <h3 className="text-lg font-semibold mb-3">Join this Debate</h3>
      <div className="flex gap-4 mb-4">
        <label className="cursor-pointer">
          <input
            type="radio"
            name="side"
            value="SUPPORT"
            checked={side === 'SUPPORT'}
            onChange={() => setSide('SUPPORT')}
            className="mr-2"
          />
          Support
        </label>
        <label className="cursor-pointer">
          <input
            type="radio"
            name="side"
            value="OPPOSE"
            checked={side === 'OPPOSE'}
            onChange={() => setSide('OPPOSE')}
            className="mr-2"
          />
          Oppose
        </label>
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button
        onClick={handleJoin}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Joining...' : 'Join Debate'}
      </button>
    </div>
  );
}
