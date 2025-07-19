'use client';

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign in to Debate Arena</h1>
      <button
        onClick={() => signIn("google")}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
} 