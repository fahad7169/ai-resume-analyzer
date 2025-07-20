import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import { useTrackInteraction } from "~/hooks/useAnalytics";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeX" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, isLoading, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const { trackButtonClick, trackFeatureUsage } = useTrackInteraction();

  useEffect(() => {
    // Only load resumes if user is authenticated and not in initial loading state
    if (!auth.isAuthenticated || isLoading) {
      setLoadingResumes(false);
      setResumes([]);
      return;
    }

    const loadResumes = async () => {
      setLoadingResumes(true);

      try {
        const resumes = (await kv.list('resume:*', true)) as KVItem[];

        const parsedResumes = resumes?.map((resume) => (
            JSON.parse(resume.value) as Resume
        ))

        setResumes(parsedResumes || []);
      } catch (error) {
        console.error('Failed to load resumes:', error);
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    }

    loadResumes()
  }, [auth.isAuthenticated, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen with-navbar">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[color:var(--color-text-secondary)]">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return <main className="min-h-screen with-navbar">
    <Navbar />

    {/* Hero Section */}
    <section className="flex flex-col items-center px-4 md:px-8 lg:px-12 pt-16 pb-8">
      {/* Hero Content */}
   

      {/* Loading State for Resumes */}
      {auth.isAuthenticated && loadingResumes && (
        <div className="flex flex-col items-center justify-center my-16">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading..." />
          <p className="text-[color:var(--color-text-secondary)] mt-4">Loading your resumes...</p>
        </div>
      )}

      {/* Analyzed Resumes Section */}
      {auth.isAuthenticated && !loadingResumes && resumes.length > 0 && (
        <div className="w-full max-w-[1400px] mx-auto px-4 mb-20">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4F75FF] to-[#FF6B6B] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--color-text-primary)]">Your Analyzed Resumes</h2>
            </div>
            
            <p className="text-[color:var(--color-text-secondary)] text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Review your previously analyzed resumes and track your progress. Click on any resume to view detailed feedback and recommendations.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-10">
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-[color:var(--color-text-primary)]">{resumes.length}</div>
                <div className="text-sm text-[color:var(--color-text-secondary)]">Total Analyzed</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-[color:var(--color-border)]"></div>
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-[#4F75FF]">
                  {Math.round(resumes.reduce((acc, resume) => acc + (resume.feedback?.overallScore || 0), 0) / resumes.length) || 0}
                </div>
                <div className="text-sm text-[color:var(--color-text-secondary)]">Avg. Score</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-[color:var(--color-border)]"></div>
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-[#00D4AA]">
                  {resumes.filter(resume => (resume.feedback?.overallScore || 0) >= 70).length}
                </div>
                <div className="text-sm text-[color:var(--color-text-secondary)]">Good Score</div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 p-4 glass-effect rounded-xl border border-[#2A3441]/50 dark:border-[#2A3441]/50 light:border-[#E5E7EB]/50 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[color:var(--color-text-secondary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[color:var(--color-text-secondary)] text-sm">
                <span className="text-[color:var(--color-text-primary)] font-medium">Tip:</span> Compare different versions to see your improvement over time
              </span>
            </div>
            <Link 
              to="/upload" 
              className="primary-button flex items-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap"
              onClick={() => trackButtonClick('analyze_new_resume', '/home')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Analyze New Resume
            </Link>
          </div>

          {/* Resumes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State / Get Started Section */}
      {(!auth.isAuthenticated || (!loadingResumes && resumes?.length === 0)) && (
        <div className="w-full max-w-4xl mx-auto px-4 text-center mb-20">
          {/* Empty State Illustration */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-[#4F75FF] to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[color:var(--color-text-primary)] mb-6">Ready to get started?</h3>
            <p className="text-[color:var(--color-text-secondary)] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              {auth.isAuthenticated 
                ? "Upload your first resume to get instant AI-powered feedback, ATS optimization tips, and personalized suggestions to help you land your dream job."
                : "Sign up and upload your resume to get instant AI-powered feedback, ATS optimization tips, and personalized suggestions to help you land your dream job."
              }
            </p>
          </div>

          {/* Quick Start Button */}
          <div className="mb-16">
            <Link 
              to={auth.isAuthenticated ? "/upload" : "/auth?next=/upload"} 
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #4F75FF 0%, #FF6B6B 50%, #FFB347 100%)',
                boxShadow: '0 8px 32px 0 rgba(79, 117, 255, 0.4)'
              }}
              onClick={() => trackButtonClick(auth.isAuthenticated ? 'upload_resume' : 'get_started', '/home')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {auth.isAuthenticated ? "Upload Resume" : "Get Started"}
            </Link>
          </div>

          {/* Benefits Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="stats-card group hover:border-[#4F75FF]/50">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4F75FF]/20 to-[#FF6B6B]/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-[#4F75FF]/20 group-hover:border-[#4F75FF]/50 transition-all duration-300">
                <svg className="w-6 h-6 text-[#4F75FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-[color:var(--color-text-primary)] mb-2">Instant Analysis</h4>
              <p className="text-sm text-[color:var(--color-text-secondary)]">Get feedback in seconds</p>
            </div>
            
            <div className="stats-card group hover:border-[#00D4AA]/50">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00D4AA]/20 to-[#4F75FF]/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-[#00D4AA]/20 group-hover:border-[#00D4AA]/50 transition-all duration-300">
                <svg className="w-6 h-6 text-[#00D4AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-[color:var(--color-text-primary)] mb-2">ATS Optimized</h4>
              <p className="text-sm text-[color:var(--color-text-secondary)]">Beat applicant tracking systems</p>
            </div>
            
            <div className="stats-card group hover:border-[#FFB347]/50">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFB347]/20 to-[#FF6B6B]/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-[#FFB347]/20 group-hover:border-[#FFB347]/50 transition-all duration-300">
                <svg className="w-6 h-6 text-[#FFB347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-[color:var(--color-text-primary)] mb-2">Track Progress</h4>
              <p className="text-sm text-[color:var(--color-text-secondary)]">Monitor all applications</p>
            </div>
          </div>
        </div>
      )}
    </section>

    {/* Feature Cards Section */}
    <section className="px-4 md:px-8 lg:px-12 py-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Lightning Fast Setup */}
          <div className="feature-card">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F75FF] to-[#667EFF] rounded-lg flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)] mb-4">Lightning Fast Analysis</h3>
            <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
              Get instant AI-powered resume feedback in seconds with our advanced analysis engine. No waiting required.
            </p>
          </div>

          {/* Ease of Use */}
          <div className="feature-card">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#FF8A80] rounded-lg flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)] mb-4">Ease of use</h3>
            <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
              Intuitive interface that makes resume analysis as simple as drag and drop. Perfect for job seekers of all levels.
            </p>
          </div>

          {/* ATS Optimization */}
          <div className="feature-card">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00D4AA] to-[#4F75FF] rounded-lg flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)] mb-4">ATS Optimization</h3>
            <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
              Our transparent scoring helps optimize your resume for Applicant Tracking Systems used by top companies.
            </p>
          </div>

          {/* 99.9% Accuracy guarantee */}
          <div className="feature-card">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFB347] to-[#FFA726] rounded-lg flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)] mb-4">99.9% Accuracy guarantee</h3>
            <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
              Rock-solid AI infrastructure that keeps your resume analysis flowing 24/7 with industry-leading precision.
            </p>
          </div>

        </div>
      </div>
    </section>
  </main>
}