import { useEffect, useState } from "react";
import type { Route } from "../+types/root";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate, Link } from "react-router";
import { ThemeToggle } from "~/components/ThemeToggle";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeX | Sign In" },
    {
      name: "description",
      content: "Sign in to access AI-powered resume analysis and feedback",
    },
  ];
}
export default function Auth() {

  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1] || "/";
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  useEffect(() => {
   if (auth.isAuthenticated) {
    navigate(next);
   }
  }, [auth.isAuthenticated, next]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await auth.signIn();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col without-navbar overflow-hidden">
      {/* Header */}
      <header className="p-4 sm:pt-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <Link to="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              ResumeX
            </Link>
          </div>
          {/* Theme Toggle for Auth Page */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="auth-container flex-1 flex items-center justify-center min-h-0">
        <div className="auth-content w-full max-w-md mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <div className="auth-hero text-center mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[color:var(--color-text-primary)] mb-2">Welcome to ResumeX</h1>
            <p className="text-[color:var(--color-text-secondary)] text-sm sm:text-base lg:text-lg">Get AI-powered feedback to land your dream job</p>
          </div>

          {/* Auth Card */}
          <div className="auth-card w-full">
            
            {auth.isAuthenticated ? (
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00D4AA] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-[color:var(--color-text-primary)] mb-2">You're signed in!</h2>
                <p className="text-sm sm:text-base text-[color:var(--color-text-secondary)] mb-4 sm:mb-6">Ready to analyze your resume?</p>
                <div className="space-y-2 sm:space-y-3">
                  <Link to="/" className="w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:from-[#4F46E5] hover:to-[#3730A3] transition-all block text-center text-sm sm:text-base">
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={auth.signOut}
                    className="w-full text-[color:var(--color-text-secondary)] py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-bg-card)] transition-all text-sm sm:text-base"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[color:var(--color-text-primary)] mb-2">Sign In</h2>
                  <p className="text-xs sm:text-sm lg:text-base text-[color:var(--color-text-secondary)]">Access your resume analysis dashboard</p>
                </div>

                {/* Sign In Options */}
                <div className="space-y-4">
                  <button 
                    onClick={handleSignIn}
                    disabled={isLoading || isSigningIn}
                    className="w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium hover:from-[#4F46E5] hover:to-[#3730A3] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm sm:text-base"
                  >
                    {isLoading || isSigningIn ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing you in...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Continue with Puter
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[color:var(--color-border)]/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-[color:var(--color-bg-card)] px-4 text-[color:var(--color-text-secondary)] font-medium">Secure & Private</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2 pt-3">
                    <div className="flex items-center gap-3 text-xs text-[color:var(--color-text-secondary)]">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00D4AA]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>AI-powered resume analysis</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[color:var(--color-text-secondary)]">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00D4AA]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>ATS optimization tips</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[color:var(--color-text-secondary)]">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00D4AA]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Track multiple applications</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-4 sm:mt-6 flex-shrink-0">
            <Link to="/" className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)] transition-colors text-xs sm:text-sm inline-flex items-center gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
