'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "../core/ThemeToggle";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-zinc-100 dark:bg-zinc-800 shadow-sm">
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-xl font-bold hover:opacity-80">
          🗣️ Debate Arena
        </Link>
        <Link href="/debates" className="hover:underline">
          Explore
        </Link>
        <Link href="/debates/create" className="hover:underline">
          Create
        </Link>
        <Link href="/scoreboard" className="hover:underline">
          Scoreboard
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {session ? (
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm">{session.user.name}</span>
            <button
              onClick={async () => {
                try {
                  await signOut();
                } catch (err) {
                  alert("Sign out failed");
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={async () => {
              try {
                await signIn("google");
              } catch (err) {
                alert("Sign in failed");
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
