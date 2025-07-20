# Google Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) for your AI Resume project.

## Prerequisites

1. A Google Analytics account
2. A Google Analytics 4 property set up
3. Your GA4 Measurement ID (starts with "G-")

## Step 1: Create a Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or create a new property
3. Choose "Web" as your platform
4. Fill in your property details:
   - Property name: "AI Resume" (or your preferred name)
   - Reporting time zone: Choose your timezone
   - Currency: Choose your currency
5. Click "Next" and complete the setup

## Step 2: Get Your Measurement ID

1. In your GA4 property, go to **Admin** (gear icon)
2. Under "Property", click **Data Streams**
3. Click on your web stream (or create one if none exists)
4. Copy the **Measurement ID** (format: G-XXXXXXXXXX)

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Google Analytics Measurement ID:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## Step 4: Verify Installation

1. Start your development server: `npm run dev`
2. Open your browser's Developer Tools
3. Go to the **Network** tab
4. Navigate through your app
5. You should see requests to `googletagmanager.com` and `google-analytics.com`

## Step 5: Test Analytics

1. Go to your Google Analytics dashboard
2. Navigate to **Reports** > **Realtime** > **Overview**
3. Visit your website and perform some actions
4. You should see real-time data appearing in the dashboard

## Available Tracking Features

The analytics setup includes tracking for:

### Automatic Tracking
- **Page Views**: Automatically tracked on route changes
- **Session Duration**: Tracked automatically by GA4

### Custom Events
- **Button Clicks**: Tracked with button name and page context
- **Form Submissions**: Tracked with form name and success status
- **Resume Uploads**: Tracked with file name and size
- **Resume Analysis**: Tracked with score and feedback status
- **User Authentication**: Tracked for sign in/up/out actions
- **Feature Usage**: Tracked for specific feature interactions
- **Errors**: Tracked with error type and message

### Usage Examples

```typescript
import { useTrackInteraction } from '~/hooks/useAnalytics';

function MyComponent() {
  const { trackButtonClick, trackFeatureUsage } = useTrackInteraction();

  const handleButtonClick = () => {
    trackButtonClick('submit_form', '/contact');
    // Your button logic here
  };

  const handleFeatureUse = () => {
    trackFeatureUsage('resume_analyzer', 'start_analysis');
    // Your feature logic here
  };

  return (
    <button onClick={handleButtonClick}>
      Submit Form
    </button>
  );
}
```

## Privacy Considerations

### GDPR Compliance
- The analytics setup respects user privacy
- No personally identifiable information (PII) is automatically collected
- Consider implementing a cookie consent banner for EU users

### Data Retention
- Google Analytics data retention is controlled by your GA4 property settings
- Default retention is 26 months for user-level data
- You can adjust this in your GA4 property settings

## Troubleshooting

### Analytics Not Working
1. Check that your Measurement ID is correct
2. Verify the `.env` file is in the project root
3. Ensure the environment variable starts with `VITE_`
4. Check browser console for any JavaScript errors

### No Data in GA4
1. Wait 24-48 hours for data to appear in standard reports
2. Check Real-time reports for immediate verification
3. Verify your GA4 property is set to "Web" platform
4. Ensure no ad blockers are interfering with analytics

### Development vs Production
- Analytics works in both development and production
- Use different GA4 properties for dev/staging/production environments
- Set up environment-specific Measurement IDs

## Advanced Configuration

### Custom Dimensions
You can add custom dimensions in your GA4 property to track additional data:

1. Go to **Admin** > **Custom Definitions**
2. Create custom dimensions for:
   - User type (free/premium)
   - Resume score ranges
   - Feature usage patterns

### Enhanced Ecommerce
For future e-commerce features, you can enable enhanced ecommerce tracking in GA4.

## Support

If you encounter issues:
1. Check the [Google Analytics Help Center](https://support.google.com/analytics/)
2. Verify your GA4 property settings
3. Test with Google Analytics Debugger browser extension
4. Check the browser console for any JavaScript errors 