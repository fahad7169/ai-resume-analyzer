import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { trackPageView, trackEvent, trackFeatureUsage } from '~/lib/analytics';

// Custom hook for analytics
export function useAnalytics() {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  // Return tracking functions
  return {
    trackEvent,
    trackPageView: (url: string, title?: string) => trackPageView(url, title),
    trackFeatureUsage,
  };
}

// Hook for tracking specific user interactions
export function useTrackInteraction() {
  const { trackEvent, trackFeatureUsage } = useAnalytics();

  const trackButtonClick = (buttonName: string, page?: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      page: page || window.location.pathname,
      event_category: 'engagement',
      event_label: 'user_interaction',
    });
  };

  const trackFormSubmission = (formName: string, success: boolean) => {
    trackEvent('form_submission', {
      form_name: formName,
      success: success,
      event_category: 'engagement',
      event_label: 'form_interaction',
    });
  };

  const trackError = (errorType: string, errorMessage: string) => {
    trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      event_category: 'error',
      event_label: 'application_error',
    });
  };

  return {
    trackButtonClick,
    trackFormSubmission,
    trackError,
    trackEvent,
    trackFeatureUsage,
  };
} 