import { useThemeStore } from "~/lib/theme";

export const ThemeToggle = () => {
  const { theme, setTheme, isDark } = useThemeStore();

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      className="relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4F75FF]/20"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1A2332 0%, #222B3D 100%)' 
          : 'linear-gradient(135deg, #FEFEFE 0%, #F8F9FA 100%)',
        border: `1px solid ${isDark ? '#2A3441' : '#E5E7EB'}`
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Handle */}
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #4F75FF 0%, #3B5FFF 100%)' 
            : 'linear-gradient(135deg, #FFB347 0%, #FFA726 100%)',
          boxShadow: isDark 
            ? '0 2px 8px rgba(79, 117, 255, 0.3)' 
            : '0 2px 8px rgba(255, 179, 71, 0.3)'
        }}
      >
        {/* Sun Icon */}
        <svg
          className={`w-3 h-3 text-white transition-all duration-300 ${
            isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        
        {/* Moon Icon */}
        <svg
          className={`w-3 h-3 text-white transition-all duration-300 absolute ${
            isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
      
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        {/* Sun background */}
        <div className={`w-3 h-3 transition-all duration-300 ${
          isDark ? 'opacity-0' : 'opacity-20'
        }`}>
          <svg
            className="w-full h-full text-[#FFB347]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        
        {/* Moon background */}
        <div className={`w-3 h-3 transition-all duration-300 ${
          isDark ? 'opacity-20' : 'opacity-0'
        }`}>
          <svg
            className="w-full h-full text-[#4F75FF]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
      </div>
    </button>
  );
}; 