'use client';

import { useState } from "react";

export default function ArgumentForm({ debateId, side, onNewArgument }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bannedWords = ["stupid", "idiot", "dumb"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Argument content cannot be empty");
      return;
    }

    // Simple toxic word check
    const lowerContent = content.toLowerCase();
    if (bannedWords.some((word) => lowerContent.includes(word))) {
      setError("Your argument contains banned words.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/arguments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, side, debateId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to post argument");
      }

      const newArg = await res.json();
      onNewArgument(newArg);
      setContent("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your argument here..."
        className="w-full p-3 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        rows={4}
        disabled={loading}
      />
      {error && <p className="text-red-600 mt-1">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Argument"}
      </button>
    </form>
  );
}
