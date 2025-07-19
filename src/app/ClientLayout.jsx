"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./components/layout/Navbar";

import { ThemeProvider } from "./components/theme/ThemeToggle";

export default function ClientLayout({ children }) {
  return (
    <div>
      <SessionProvider>
      <ThemeProvider> <Navbar />
      <main className="p-4">{children}</main></ThemeProvider>
      </SessionProvider>
    </div>
  );
}
