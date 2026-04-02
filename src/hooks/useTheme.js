import { useState, useEffect } from "react";

export const THEMES = [
  { id: "classic", label: "Classic", color: "#3b82f6" },
  { id: "midnight", label: "Midnight", color: "#6366f1" },
  { id: "forest", label: "Forest", color: "#22c55e" },
  { id: "crimson", label: "Crimson", color: "#ef4444" },
];

const STORAGE_KEY = "quizMillionaire_theme";

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "classic",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme, themes: THEMES };
}
