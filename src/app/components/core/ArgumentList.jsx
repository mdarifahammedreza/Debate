'use client';

import { useState } from "react";

export default function ArgumentList({ argumentsList, userId, onVote }) {
  const [votesByUser, setVotesByUser] = useState({}); // argumentId -> true if voted

  // Mock votesByUser management — ideally get from API or global state
  // For demo, just locally toggle votes

  const handleVote = async (argumentId) => {
    if (votesByUser[argumentId]) {
      // Already voted, maybe allow unvote via DELETE
      // Simplified: disallow re-voting
      return;
    }
    // Post vote API call
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ argumentId }),
      });
      if (!res.ok) throw new Error("Vote failed");
      setVotesByUser((prev) => ({ ...prev, [argumentId]: true }));
      onVote(argumentId);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-4">
      {argumentsList.map((arg) => (
        <div
          key={arg.id}
          className="border p-3 rounded bg-white dark:bg-zinc-700 dark:border-zinc-600"
        >
          <p>{arg.content}</p>
          <div className="flex justify-between mt-2 items-center">
            <small className="text-xs text-gray-500 dark:text-gray-400">
              By {arg.author.name} • {new Date(arg.createdAt).toLocaleString()}
            </small>
            <div className="flex items-center gap-3">
              <span>{arg.votes.length} votes</span>
              <button
                onClick={() => handleVote(arg.id)}
                disabled={votesByUser[arg.id]}
                className="px-2 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {votesByUser[arg.id] ? "Voted" : "Vote"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
