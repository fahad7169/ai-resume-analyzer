import { Link } from "react-router"
import { useState, useEffect, useRef } from "react"
import { usePuterStore } from "~/lib/puter"
import { ThemeToggle } from "./ThemeToggle"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { auth } = usePuterStore();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <nav className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-40">
      <div className="glass-effect rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 shadow-2xl max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] bg-clip-text text-transparent">
              ResumeX
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Analyze Resume Button */}
            <Link to="/upload" className="primary-button px-6 py-3">
              Analyze Resume
            </Link>
            
            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-[color:var(--color-bg-card)]/20 rounded-xl border border-[color:var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 hover:bg-[color:var(--color-bg-card)]/40"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <svg className="w-4 h-4 text-[color:var(--color-text-secondary)] transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[color:var(--color-bg-card)]/95 backdrop-blur-xl rounded-xl border border-[color:var(--color-border)]/50 shadow-2xl py-2 z-50">
                  {/* User Info */}
                  {auth.isAuthenticated && (
                    <div className="px-4 py-3 border-b border-[color:var(--color-border)]/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{auth.user?.username || 'User'}</p>
                          <p className="text-xs text-[color:var(--color-text-secondary)]">Signed in</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)]/30">
                    <span className="text-sm font-medium text-[color:var(--color-text-secondary)]">Theme</span>
                    <ThemeToggle />
                  </div>
                  
                  {/* Auth Actions */}
                  {auth.isAuthenticated ? (
                    <button 
                      onClick={() => {
                        auth.signOut();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 py-3 px-4 hover:bg-red-50/50 dark:hover:bg-red-500/10"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <Link 
                      to="/auth" 
                      className="block text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-all duration-200 py-3 px-4 hover:bg-[color:var(--color-bg-secondary)]/50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-[#A5B4C7] hover:text-gray-900 dark:hover:text-white transition-all duration-200 rounded-xl hover:bg-gray-100/50 dark:hover:bg-[#2A3441]/30 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                  className="animate-in spin-in-180 duration-200"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                  className="animate-in fade-in duration-200"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-[600px] opacity-100 mt-4 pt-4 border-t border-gray-200/50 dark:border-[#2A3441]/50' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-1">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between py-3 px-4">
              <span className="text-[color:var(--color-text-secondary)] text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
            
            {/* Navigation Links */}
            <Link 
              to="/" 
              className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-all duration-200 py-3 px-4 rounded-xl hover:bg-[color:var(--color-bg-secondary)]/50 touch-manipulation min-h-[48px] flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* CTA Button */}
            <Link 
              to="/upload" 
              className="primary-button mx-4 my-2 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analyze Resume
            </Link>
            
            {/* Auth Section */}
            {auth.isAuthenticated ? (
              <div className="border-t border-gray-200/50 dark:border-[#2A3441]/50 pt-3 mt-3 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-[color:var(--color-text-primary)] font-medium">Signed in as {auth.user?.username || 'User'}</span>
                </div>
                <button 
                  onClick={() => {
                    auth.signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 py-3 px-4 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-500/10 w-full text-left touch-manipulation min-h-[48px] flex items-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-[color:var(--color-border)]/50 pt-3 mt-3">
                <Link 
                  to="/auth" 
                  className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-all duration-200 py-3 px-4 rounded-xl hover:bg-[color:var(--color-bg-secondary)]/50 block touch-manipulation min-h-[48px] flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar