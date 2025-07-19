'use client';

import { useEffect, useState } from "react";

export default function Scoreboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState("all-time");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        // For now, just fetch all-time. Filters can be implemented in API later.
        const res = await fetch("/api/scoreboard");
        const data = await res.json();
        setLeaderboard(data || []);
      } catch (e) {
        console.error("Failed to load scoreboard", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [filter]);

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Top Debaters</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            filter === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-zinc-700"
          }`}
          onClick={() => setFilter("weekly")}
        >
          Weekly
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-zinc-700"
          }`}
          onClick={() => setFilter("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "all-time" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-zinc-700"
          }`}
          onClick={() => setFilter("all-time")}
        >
          All Time
        </button>
      </div>

      {loading && <p className="text-center">Loading leaderboard...</p>}

      {!loading && leaderboard.length === 0 && (
        <p className="text-center text-gray-500">No leaderboard data available.</p>
      )}

      {!loading && leaderboard.length > 0 && (
        <table className="w-full text-left border-collapse border border-gray-300 dark:border-zinc-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-zinc-700">
              <th className="border border-gray-300 dark:border-zinc-600 px-4 py-2">Username</th>
              <th className="border border-gray-300 dark:border-zinc-600 px-4 py-2">Total Votes</th>
              <th className="border border-gray-300 dark:border-zinc-600 px-4 py-2">
                Debates Participated
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
              <tr
                key={user.id}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-zinc-800 dark:even:bg-zinc-700"
              >
                <td className="border border-gray-300 dark:border-zinc-600 px-4 py-2">
                  {user.name}
                </td>
                <td className="border border-gray-300 dark:border-zinc-600 px-4 py-2">
                  {user.totalVotes}
                </td>
                <td className="border border-gray-300 dark:border-zinc-600 px-4 py-2">
                  {user.debatesParticipated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
