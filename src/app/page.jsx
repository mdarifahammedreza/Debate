'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    async function fetchDebates() {
      try {
        const res = await fetch('/api/debate');
        const data = await res.json();
        setDebates(data);
      } catch (err) {
        console.error('Failed to load debates:', err);
      }
    }
    fetchDebates();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔥 Community Debate Arena</h1>
        <Link
          href="/debates/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + New Debate
        </Link>
      </div>

      {debates.length === 0 ? (
        <p className="text-gray-500">No debates found. <span className='bg-white text-red-100'> showing this bcz database commonication failed re run prisma server on docker engine </span></p>
      ) : (
        <ul className="space-y-4">
          {debates.map((debate) => (
            <li
              key={debate.id}
              className="border rounded p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{debate.title}</h2>
                <span className="text-sm text-gray-400">
                  {new Date(debate.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{debate.description}</p>
              <div className="mt-2">
                <Link
                  href={`/debate/${debate.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Debate →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
