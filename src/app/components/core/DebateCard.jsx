
'use client';

import Link from "next/link";

export default function DebateCard({ debate }) {
  const { id, title, category, tags, bannerUrl, startTime, endTime } = debate;

  // Calculate time remaining (simple version)
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end - now;
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  return (
    <div className="border rounded-md overflow-hidden shadow hover:shadow-lg transition-shadow bg-white dark:bg-zinc-800">
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt={`${title} banner`}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{category}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm mb-4">
          Time remaining: <span className="font-semibold">{diffHours} hours</span>
        </p>
        <Link
          href={`/debates/${id}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Debate
        </Link>
      </div>
    </div>
  );
}
