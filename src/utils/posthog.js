import posthog from 'posthog-js';

// Initialize PostHog with your project API key
const initPostHog = () => {
  // Get API key and host from environment variables
  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY || 'phc_BNG4S68NiedljTLsvzMj4tNztJN86hlimVOM5od5888';
  
  // Use a proxy URL for development to avoid CORS issues
  const isDevelopment = import.meta.env.DEV || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
  
  // For development, use our proxy. For production, use the actual PostHog URL
  const apiHost = isDevelopment 
    ? window.location.origin + '/posthog-proxy' 
    : (import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com');
  
  // Current hostname
  const hostname = window.location.hostname;
  
  console.log(`Initializing PostHog with key ${apiKey} and host ${apiHost}`);
  
  // Skip domain validation to ensure it works everywhere
  try {
    // Initialize with proper configuration
    posthog.init(apiKey, {
      api_host: apiHost,
      // Enable autocapture for all user interactions
      autocapture: true,
      // Explicitly enable page view capturing
      capture_pageview: true,
      // Send event data periodically
      persistence: 'localStorage',
      // Capture pageview events on history changes for SPA
      capture_pageleave: true,
      // Extended debugging
      debug: true,
      // Disable request batching for immediate feedback
      batch_requests: false,
      // Quick retry for failed requests
      bootstrap: {
        distinctID: 'anonymous_user',
        isIdentifiedID: false,
      },
      // Callback when loaded
      loaded: (loadedPosthog) => {
        console.log('PostHog library loaded successfully');
        
        // Immediately capture a test event to verify connection
        posthog.capture('test_connection', {
          timestamp: new Date().toISOString(),
          environment: isDevelopment ? 'development' : 'production'
        });
      },
      // Disable local development filtering
      disable_session_recording: false,
      respect_dnt: false
    });
    
    // Record the page view immediately
    posthog.capture('$pageview');
    
    // For SPAs, we need to manually register page views on route changes
    const handleRouteChange = () => {
      console.log('Route change detected, capturing $pageview');
      posthog.capture('$pageview');
    };

    // Add event listeners for SPA navigation
    window.addEventListener('popstate', handleRouteChange);
    
    // Also track history API changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(this, arguments);
      handleRouteChange();
    };
    
    console.log(`PostHog successfully initialized on domain: ${hostname}`);
    return true;
  } catch (error) {
    console.error('PostHog initialization error:', error);
    return false;
  }
};

export { posthog, initPostHog }; 