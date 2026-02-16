"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      className="px-4 py-2 border rounded"
      onClick={() => setIsDark(!isDark)}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
