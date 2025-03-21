import { posthog } from './posthog';

/**
 * Manually track a page view with PostHog
 * @param {Object} options - Additional options for the page view event
 * @param {string} options.pageName - Name of the page (optional)
 * @param {string} options.pageTitle - Title of the page (optional, defaults to document.title)
 * @param {string} options.path - Path of the page (optional, defaults to location.pathname)
 * @param {Object} options.properties - Additional properties to include with the event
 */
export const trackPageView = (options = {}) => {
  const {
    pageName,
    pageTitle = document.title,
    path = window.location.pathname,
    properties = {},
  } = options;

  try {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path,
      page_title: pageTitle,
      page_name: pageName,
      page_location: window.location.href,
      ...properties,
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to track page view:', error);
    }
  }
};

/**
 * Track a custom view (for components that aren't full pages)
 * @param {string} viewName - Name of the view
 * @param {Object} properties - Additional properties
 */
export const trackComponentView = (viewName, properties = {}) => {
  try {
    posthog.capture('component_view', {
      component_name: viewName,
      path: window.location.pathname,
      ...properties,
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to track component view:', error);
    }
  }
};

export default trackPageView; 