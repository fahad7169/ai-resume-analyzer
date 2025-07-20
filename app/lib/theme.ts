import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      isDark: typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : true,
      isLight: typeof window !== "undefined" ? !window.matchMedia("(prefers-color-scheme: dark)").matches : false,
      setTheme: (theme: Theme) => {
        set({ theme });
        const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
        set({ isDark, isLight: !isDark });
        
        // Apply theme to document
        const root = document.documentElement;
        if (isDark) {
          root.classList.add("dark");
          root.classList.remove("light");
        } else {
          root.classList.add("light");
          root.classList.remove("dark");
        }
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        get().setTheme(newTheme);
      },
    }),
    {
      name: "resumex-theme",
    }
  )
);

// Initialize theme on app load
export const initializeTheme = () => {
  const { theme } = useThemeStore.getState();
  useThemeStore.getState().setTheme(theme);
  
  // Listen for system theme changes
  if (theme === "system") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      useThemeStore.getState().setTheme("system");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }
}; 