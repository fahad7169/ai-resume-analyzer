import { Link } from "react-router"
import { useState, useEffect } from "react"
import { usePuterStore } from "~/lib/puter"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { auth } = usePuterStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-40">
      <div className="glass-effect rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 shadow-2xl max-w-7xl mx-auto border border-[#2A3441]/50">
        <div className="flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4 sm:gap-8">
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
          
          </div>
          {/* Auth & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Auth */}
            {auth.isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-2 bg-[#0A0E1A]/50 rounded-xl border border-[#2A3441]/50 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">User</span>
                </div>
                <button 
                  onClick={auth.signOut}
                  className="text-[#A5B4C7] hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-[#2A3441]/30"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-[#A5B4C7] hover:text-white transition-colors hidden lg:block px-4 py-2 rounded-xl hover:bg-[#2A3441]/30">
                Sign In
              </Link>
            )}
            {/* CTA Button - Responsive */}
            <Link to="/upload" className="primary-button text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
              <span className="hidden sm:inline">{auth.isAuthenticated ? 'Upload Resume' : 'Get Started'}</span>
              <span className="sm:hidden">{auth.isAuthenticated ? 'Upload' : 'Start'}</span>
            </Link>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#A5B4C7] hover:text-white transition-all duration-200 rounded-xl hover:bg-[#2A3441]/30 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
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
        </div>
        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-[500px] opacity-100 mt-4 pt-4 border-t border-[#2A3441]/50' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-1">
            {/* Navigation Links */}
            <Link 
              to="/" 
              className="text-[#A5B4C7] hover:text-white transition-all duration-200 py-3 px-4 rounded-xl hover:bg-[#2A3441]/30 touch-manipulation min-h-[48px] flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className="text-[#A5B4C7] hover:text-white transition-all duration-200 py-3 px-4 rounded-xl hover:bg-[#2A3441]/30 touch-manipulation min-h-[48px] flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Upload
            </Link>
            {/* Auth Section */}
            {auth.isAuthenticated ? (
              <div className="border-t border-[#2A3441]/50 pt-3 mt-3 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Signed in as User</span>
                </div>
                <button 
                  onClick={() => {
                    auth.signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300 transition-all duration-200 py-3 px-4 rounded-xl hover:bg-red-500/10 w-full text-left touch-manipulation min-h-[48px] flex items-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-[#2A3441]/50 pt-3 mt-3">
                <Link 
                  to="/auth" 
                  className="text-[#A5B4C7] hover:text-white transition-all duration-200 py-3 px-4 rounded-xl hover:bg-[#2A3441]/30 block touch-manipulation min-h-[48px] flex items-center"
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