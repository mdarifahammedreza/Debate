'use client';
import { useEffect, useState } from "react";
import DebateCard from "../components/core/DebateCard";
import DebateFilterBar from "../components/core/DebateFilterBar";

export default function DebateListPage() {
  const [debates, setDebates] = useState([]);
  const [filteredDebates, setFilteredDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract unique categories and tags for filters
  const categories = Array.from(new Set(debates.map(d => d.category))).sort();
  const allTags = debates.flatMap(d => d.tags);
  const tags = Array.from(new Set(allTags)).sort();

  useEffect(() => {
    async function fetchDebates() {
      setLoading(true);
      try {
        const res = await fetch("/api/debates");
        const data = await res.json();
        setDebates(data || []);
        setFilteredDebates(data || []);
      } catch (e) {
        console.error("Failed to fetch debates", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDebates();
  }, []);

  const handleFilterChange = ({ category, tag, sort }) => {
    let filtered = [...debates];

    if (category) {
      filtered = filtered.filter(d => d.category === category);
    }
    if (tag) {
      filtered = filtered.filter(d => d.tags.includes(tag));
    }

    if (sort === "newest") {
      filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } else if (sort === "mostVoted") {
      // If debate objects don't have votes count, skip or implement accordingly
      filtered.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));
    } else if (sort === "endingSoon") {
      filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    }

    setFilteredDebates(filtered);
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Debates</h1>

      <DebateFilterBar categories={categories} tags={tags} onFilterChange={handleFilterChange} />

      {loading && <p className="text-center">Loading debates...</p>}

      {!loading && filteredDebates.length === 0 && (
        <p className="text-center text-gray-500">No debates found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDebates.map((debate) => (
          <DebateCard key={debate.id} debate={debate} />
        ))}
      </div>
    </section>
  );
}
