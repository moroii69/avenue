import { OpenPanel } from '@openpanel/web';
import { posthog } from './posthog';

// Initialize OpenPanel with the provided credentials
const op = new OpenPanel({
  clientId: 'c6bf4086-5428-4ba8-b28e-27243558a9f6',
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true,
});

// Helper function to track event views (OpenPanel)
export const trackEventView = (eventId, eventName) => {
  op.track('event_view', { 
    eventId, 
    eventName,
    timestamp: new Date().toISOString()
  });
  
  // Also track in PostHog
  trackEvent('event_view', {
    event_id: eventId,
    event_name: eventName,
    timestamp: new Date().toISOString()
  });
};

// Helper function to identify users when they log in (OpenPanel)
export const identifyOpenPanelUser = (userId, userData) => {
  op.identify({
    profileId: userId,
    ...userData
  });
};

/**
 * Track a page view in PostHog
 * @param {string} pageName - Name of the page
 * @param {Object} properties - Additional properties to track with the page view
 */
export const trackPageView = (pageName, properties = {}) => {
  try {
    // Use the proper $pageview event name that PostHog expects
    posthog.capture('$pageview', {
      // Add proper PostHog property prefixes
      $current_url: window.location.href,
      $screen_name: pageName || document.title,
      // Keep other properties without dollar sign prefix
      pageName: pageName,
      ...properties
    });
    console.log(`Tracked page view: ${pageName}`);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to track page view:', error);
    }
  }
};

/**
 * Track a custom event in PostHog
 * @param {string} eventName - Name of the event
 * @param {Object} properties - Additional properties to track with the event
 */
export const trackEvent = (eventName, properties = {}) => {
  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    // Silent fail in production, log in development
    if (import.meta.env.DEV) {
      console.error('Failed to track event:', error);
    }
  }
};

/**
 * Identify a user in PostHog
 * @param {string} userId - Unique identifier for the user
 * @param {Object} properties - Additional user properties
 */
export const identifyUser = (userId, properties = {}) => {
  try {
    // Identify in PostHog
    posthog.identify(userId, properties);
    
    // Also identify in OpenPanel if you want to track in both systems
    identifyOpenPanelUser(userId, properties);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to identify user:', error);
    }
  }
};

/**
 * Reset the current user
 */
export const resetUser = () => {
  try {
    posthog.reset();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to reset user:', error);
    }
  }
};

/**
 * Enable or disable tracking
 * @param {boolean} enabled - Whether tracking should be enabled
 */
export const setTrackingEnabled = (enabled) => {
  try {
    if (enabled) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to update tracking settings:', error);
    }
  }
};

// Export the OpenPanel instance for direct use
export default op; 