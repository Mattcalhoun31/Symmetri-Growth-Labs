import { useState, useRef, useEffect } from "react";

interface VideoBackgroundProps {
  videoSrc?: string;
  fallbackImage?: string;
  overlayOpacity?: number;
  className?: string;
}

export function VideoBackground({ 
  videoSrc, 
  fallbackImage,
  overlayOpacity = 0.7,
  className = "" 
}: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference safely
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Lazy load video when in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked
        setIsVideoError(true);
      });
    }
  };

  // Handle video error
  const handleVideoError = () => {
    setIsVideoError(true);
  };

  // Pause video when not visible for performance
  useEffect(() => {
    if (!videoRef.current) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isVideoLoaded]);

  const showVideo = videoSrc && isInView && !isVideoError && !prefersReducedMotion;
  const showFallback = fallbackImage && (!showVideo || !isVideoLoaded);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      data-testid="video-background"
    >
      {/* Fallback image */}
      {showFallback && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url(${fallbackImage})`,
            opacity: isVideoLoaded ? 0 : 1,
          }}
          data-testid="video-fallback-image"
        />
      )}

      {/* Video element - only render if video source provided and in view */}
      {showVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          data-testid="video-element"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Dark overlay for text readability */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
        data-testid="video-overlay"
      />

      {/* Gradient fade at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
        data-testid="video-gradient"
      />
    </div>
  );
}

// Predefined video themes for easy switching
export const VIDEO_THEMES = {
  tech: {
    description: "Futuristic tech patterns and data visualization",
    overlayOpacity: 0.75,
  },
  abstract: {
    description: "Abstract flowing shapes and gradients",
    overlayOpacity: 0.7,
  },
  network: {
    description: "Network nodes and connections",
    overlayOpacity: 0.8,
  },
  space: {
    description: "Space and particles",
    overlayOpacity: 0.65,
  },
} as const;
