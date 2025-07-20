// Google Analytics 4 Configuration
// (No dynamic script injection needed; script is loaded in <head>)
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// No-op: GA is loaded in <head>
export function initializeGA() {
  // No operation needed
}

// Track page views
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-0TXNQL44Y1';
  window.gtag('config', measurementId, {
    page_title: title || document.title,
    page_location: url,
  });
}

// Track custom events
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, parameters);
}

// Track resume upload
export function trackResumeUpload(fileName: string, fileSize: number) {
  trackEvent('resume_upload', {
    file_name: fileName,
    file_size: fileSize,
    event_category: 'engagement',
    event_label: 'resume_analysis',
  });
}

// Track resume analysis completion
export function trackResumeAnalysis(score: number, hasFeedback: boolean) {
  trackEvent('resume_analysis_complete', {
    score: score,
    has_feedback: hasFeedback,
    event_category: 'engagement',
    event_label: 'resume_analysis',
  });
}

// Track user authentication
export function trackAuth(action: 'sign_in' | 'sign_up' | 'sign_out') {
  trackEvent('user_authentication', {
    action: action,
    event_category: 'engagement',
    event_label: 'user_management',
  });
}

// Track feature usage
export function trackFeatureUsage(featureName: string, action?: string) {
  trackEvent('feature_usage', {
    feature_name: featureName,
    action: action || 'view',
    event_category: 'engagement',
    event_label: 'feature_interaction',
  });
} 