"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
