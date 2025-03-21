import React, { useEffect } from "react";
import {
  trackEvent,
  identifyUser,
  resetUser,
  setTrackingEnabled,
} from "./analytics";

// Example component showing how to use PostHog
const PostHogExamples = () => {
  useEffect(() => {
    // Example: Track page view (this might be redundant as PostHog can be configured to track pages automatically)
    trackEvent("page_viewed", { page: "PostHogExamples" });
  }, []);

  // Example handler for button click
  const handleButtonClick = () => {
    trackEvent("button_clicked", {
      button_name: "example_button",
      location: "PostHogExamples component",
    });
  };

  // Example handler for user identification
  const handleIdentifyUser = () => {
    // This would typically be called when a user logs in
    const userId = "user-123";
    identifyUser(userId, {
      name: "Example User",
      email: "user@example.com",
      plan: "premium",
    });
  };

  // Example handler for resetting user
  const handleResetUser = () => {
    // This would typically be called when a user logs out
    resetUser();
  };

  // Example handler for enabling/disabling tracking
  const handleToggleTracking = (enabled) => {
    setTrackingEnabled(enabled);
  };

  return (
    <div>
      <h1>PostHog Usage Examples</h1>

      <div>
        <h2>Event Tracking Example</h2>
        <button onClick={handleButtonClick}>Track Button Click</button>
      </div>

      <div>
        <h2>User Identification Example</h2>
        <button onClick={handleIdentifyUser}>Identify User</button>
        <button onClick={handleResetUser}>Reset User</button>
      </div>

      <div>
        <h2>Opt In/Out Example</h2>
        <button onClick={() => handleToggleTracking(true)}>
          Enable Tracking
        </button>
        <button onClick={() => handleToggleTracking(false)}>
          Disable Tracking
        </button>
      </div>
    </div>
  );
};

export default PostHogExamples;
