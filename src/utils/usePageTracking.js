import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from './posthog';

/**
 * Custom hook to track page views in React with PostHog
 */
const usePageTracking = () => {
  const location = useLocation();
  const prevPathRef = useRef('');

  useEffect(() => {
    // Skip tracking if it's the initial render and the path hasn't changed
    if (prevPathRef.current === location.pathname) {
      return;
    }

    // Track page view with PostHog
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname,
      search_query: location.search,
      hash: location.hash,
      previous_path: prevPathRef.current,
    });

    // Update the previous path
    prevPathRef.current = location.pathname;
  }, [location]);
};

export default usePageTracking; 