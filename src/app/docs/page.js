"use client";

import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    // Dynamically load the Redoc script
    const script = document.createElement("script");
    script.src = "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <redoc spec-url="/openapi.json"></redoc>
    </div>
  );
} 