'use client';

import { useState } from "react";

const durations = [
  { label: "1 Hour", value: 1 },
  { label: "12 Hours", value: 12 },
  { label: "24 Hours", value: 24 },
];

export default function DebateForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(1);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !category.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // Prepare form data (including banner image)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags); // comma-separated string
    formData.append("category", category);
    formData.append("durationHours", duration);
    if (bannerFile) {
      formData.append("banner", bannerFile);
    }

    // Send formData to API or pass to parent
    try {
      await onSubmit(formData);
      // Reset form
      setTitle("");
      setDescription("");
      setTags("");
      setCategory("");
      setDuration(1);
      setBannerFile(null);
      setBannerPreview(null);
    } catch (err) {
      setError(err.message || "Failed to create debate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-4 bg-white dark:bg-zinc-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Debate</h2>

      <div>
        <label className="block mb-1 font-semibold">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
          placeholder="e.g. tech, ethics"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Category *</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-300"
        />
        {bannerPreview && (
          <img
            src={bannerPreview}
            alt="Banner Preview"
            className="mt-2 max-h-48 object-contain rounded"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 font-semibold">Duration *</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
          required
        >
          {durations.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Debate"}
      </button>
    </form>
  );
}
