import { useCallback, useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";

type EventType = 
  | "page_view"
  | "scroll_depth"
  | "cta_click"
  | "section_view"
  | "form_start"
  | "form_submit"
  | "time_on_page"
  | "demo_modal_open"
  | "demo_modal_close"
  | "script_scan"
  | "roi_calculate";

interface EventData {
  [key: string]: string | number | boolean | null | undefined;
}

// Generate or retrieve visitor ID from localStorage
function getVisitorId(): string {
  const key = "symmetri_visitor_id";
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
}

// Generate session ID (new per tab/browser session)
function getSessionId(): string {
  const key = "symmetri_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

// Event queue for batch sending
let eventQueue: Array<{
  eventType: string;
  eventData?: EventData;
  sessionId: string;
  visitorId: string;
  pageUrl: string;
  timestamp: number;
}> = [];

let flushTimeout: ReturnType<typeof setTimeout> | null = null;

async function flushEvents() {
  if (eventQueue.length === 0) return;
  
  const eventsToSend = [...eventQueue];
  eventQueue = [];
  
  try {
    await apiRequest("POST", "/api/analytics/batch", { events: eventsToSend });
  } catch (error) {
    console.warn("Failed to send analytics batch:", error);
    // Re-queue failed events (up to a limit to prevent memory issues)
    if (eventQueue.length < 100) {
      eventQueue = [...eventsToSend, ...eventQueue];
    }
  }
}

function scheduleFlush() {
  if (flushTimeout) return;
  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushEvents();
  }, 2000); // Batch events every 2 seconds
}

function queueEvent(event: {
  eventType: string;
  eventData?: EventData;
  sessionId: string;
  visitorId: string;
  pageUrl: string;
}) {
  eventQueue.push({
    ...event,
    timestamp: Date.now(),
  });
  scheduleFlush();
}

// Flush events on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", flushEvents);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushEvents();
    }
  });
}

export function useAnalytics() {
  const visitorId = useRef<string | null>(null);
  const sessionId = useRef<string | null>(null);
  const pageLoadTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const lastScrollDepthTracked = useRef<number>(0);

  useEffect(() => {
    visitorId.current = getVisitorId();
    sessionId.current = getSessionId();
  }, []);

  const trackEvent = useCallback((eventType: EventType, eventData?: EventData) => {
    if (!visitorId.current || !sessionId.current) return;
    
    queueEvent({
      eventType,
      eventData,
      sessionId: sessionId.current,
      visitorId: visitorId.current,
      pageUrl: window.location.href,
    });
  }, []);

  const trackPageView = useCallback(() => {
    trackEvent("page_view", {
      path: window.location.pathname,
      referrer: document.referrer || null,
    });
  }, [trackEvent]);

  const trackCTAClick = useCallback((ctaName: string, ctaLocation: string) => {
    trackEvent("cta_click", {
      ctaName,
      ctaLocation,
    });
  }, [trackEvent]);

  const trackSectionView = useCallback((sectionId: string) => {
    trackEvent("section_view", {
      sectionId,
    });
  }, [trackEvent]);

  const trackScrollDepth = useCallback((depth: number) => {
    // Only track at 25%, 50%, 75%, 100% milestones
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(m => depth >= m && m > lastScrollDepthTracked.current);
    
    if (currentMilestone) {
      lastScrollDepthTracked.current = currentMilestone;
      trackEvent("scroll_depth", {
        depth: currentMilestone,
      });
    }
  }, [trackEvent]);

  const trackTimeOnPage = useCallback(() => {
    const timeSpent = Math.round((Date.now() - pageLoadTime.current) / 1000);
    trackEvent("time_on_page", {
      seconds: timeSpent,
    });
  }, [trackEvent]);

  const trackFormStart = useCallback((formName: string) => {
    trackEvent("form_start", {
      formName,
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    trackEvent("form_submit", {
      formName,
      success,
    });
  }, [trackEvent]);

  const trackDemoModalOpen = useCallback((source: string) => {
    trackEvent("demo_modal_open", {
      source,
    });
  }, [trackEvent]);

  const trackDemoModalClose = useCallback((submitted: boolean) => {
    trackEvent("demo_modal_close", {
      submitted,
    });
  }, [trackEvent]);

  const trackScriptScan = useCallback((passed: boolean, score: number) => {
    trackEvent("script_scan", {
      passed,
      score,
    });
  }, [trackEvent]);

  const trackROICalculate = useCallback((teamSize: number, annualSavings: number) => {
    trackEvent("roi_calculate", {
      teamSize,
      annualSavings,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackSectionView,
    trackScrollDepth,
    trackTimeOnPage,
    trackFormStart,
    trackFormSubmit,
    trackDemoModalOpen,
    trackDemoModalClose,
    trackScriptScan,
    trackROICalculate,
    maxScrollDepth,
  };
}

// Scroll depth tracking hook
export function useScrollDepthTracking() {
  const { trackScrollDepth } = useAnalytics();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      trackScrollDepth(scrollPercent);
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [trackScrollDepth]);
}

// Time on page tracking hook
export function useTimeOnPageTracking() {
  const { trackTimeOnPage } = useAnalytics();
  
  useEffect(() => {
    // Track time at intervals: 30s, 60s, 120s, 300s
    const intervals = [30, 60, 120, 300];
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    intervals.forEach(seconds => {
      timers.push(setTimeout(() => {
        trackTimeOnPage();
      }, seconds * 1000));
    });
    
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [trackTimeOnPage]);
}
