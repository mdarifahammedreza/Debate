'use client';

import { useState } from "react";

export default function DebateFilterBar({ categories, tags, onFilterChange }) {
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");

  const handleChange = () => {
    onFilterChange({ category, tag, sort });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center justify-center">
      {/* Category */}
      <select
        className="px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setTimeout(handleChange, 0);
        }}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Tag */}
      <select
        className="px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
        value={tag}
        onChange={(e) => {
          setTag(e.target.value);
          setTimeout(handleChange, 0);
        }}
      >
        <option value="">All Tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        className="px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setTimeout(handleChange, 0);
        }}
      >
        <option value="newest">Newest</option>
        <option value="mostVoted">Most Voted</option>
        <option value="endingSoon">Ending Soon</option>
      </select>
    </div>
  );
}
