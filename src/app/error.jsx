"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h2 className="text-3xl font-bold text-red-600">Something went wrong!</h2>
      <p className="mt-4 text-gray-700">
        {error?.message || "An unexpected error has occurred."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
