'use client'
import DebateForm from "../../components/core/DebateForm";

export default function CreateDebatePage() {
  const onSubmit = async (formData) => {
    // Convert FormData to JSON for API (except for banner image)
    const data = Object.fromEntries(formData.entries());
    // Convert tags from comma-separated string to array
    if (data.tags) {
      data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    // Convert durationHours to number and map to duration
    if (data.durationHours) {
      data.duration = Number(data.durationHours);
      delete data.durationHours;
    }
    // Handle banner image upload (not supported in current API, so just skip for now)
    delete data.banner;

    const res = await fetch("/api/debates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create debate");
    }
    return await res.json();
  };
  return (
    <section className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Debate</h1>
      <DebateForm onSubmit={onSubmit}/>
    </section>
  );
}
