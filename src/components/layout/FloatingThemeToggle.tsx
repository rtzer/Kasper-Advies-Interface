import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl"
      aria-label="Toggle theme"
      title={darkMode ? "Schakel naar lichte modus" : "Schakel naar donkere modus"}
    >
      {darkMode ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
    </button>
  );
}
