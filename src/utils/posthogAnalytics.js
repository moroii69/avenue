import { posthog } from "./posthog";
import url from "../constants/url";

export const getEventIdFromSlug = async (eventSlug) => {
  if (!eventSlug) return null;

  try {
    const response = await fetch(`${url}/event/get-by-name/${eventSlug}`);
    const data = await response.json();

    if (response.ok && data) {
      return data._id;
    }
    return null;
  } catch (error) {
    console.error("Error getting event ID from slug:", error);
    return null;
  }
};

export const getEventSlugFromId = async (eventId) => {
  if (!eventId) return null;

  try {
    const response = await fetch(`${url}/event/${eventId}`);
    const data = await response.json();

    if (response.ok && data) {
      return data.event_name;
    }
    return null;
  } catch (error) {
    console.error("Error getting event slug from ID:", error);
    return null;
  }
};

export const getVisitCountFromAPI = async (eventId) => {
  if (!eventId) return 0;

  try {
    const response = await fetch(`${url}/visit/get-visit/${eventId}`);
    const data = await response.json();

    if (response.ok && data) {
      return data.count || 0;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching visit count from API:", error);
    return 0;
  }
};

export const resetEventViewCount = async (eventId) => {
  if (!eventId) return false;

  try {
    const response = await fetch(`${url}/visit/reset-visit/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error resetting event view count:", error);
    return false;
  }
};

export const getEventPageViews = async (eventId) => {
  if (!eventId) return 0;

  try {
    const result = await posthog.api.get("api/event", {
      event: "$pageview",
      properties: {
        event_id: eventId,
        page_type: "event_details",
        is_user_facing: true,
      },
      type: "events",
      date_from: "-30d",
    });

    if (result && result.data && result.data.results) {
      return result.data.results.length;
    }

    return 0;
  } catch (error) {
    console.error("Error fetching event page views from PostHog:", error);
    return 0;
  }
};

export const getUserFacingPageViews = async () => {
  try {
    const result = await posthog.api.get("api/insight", {
      insight: "TRENDS",
      events: [
        {
          id: "$pageview",
          name: "$pageview",
          type: "events",
          order: 0,
          properties: [
            {
              key: "is_user_facing",
              value: ["true"],
              operator: "exact",
              type: "event",
            },
          ],
        },
      ],
      breakdown: "path",
      date_from: "-30d",
    });

    if (result && result.data && result.data.results) {
      return result.data.results;
    }

    return {};
  } catch (error) {
    console.error("Error fetching user-facing page views:", error);
    return {};
  }
};

export const trackEventPageView = (eventId, eventName) => {
  if (!eventId) return;
  posthog.capture("$pageview", {
    event_id: eventId,
    event_name: eventName,
    page_type: "event_details",
  });
};
