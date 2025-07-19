'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <h2>Global Error</h2>
        <button onClick={() => reset()}>Try again</button>
        <pre>{error?.message}</pre>
      </body>
    </html>
  );
} 