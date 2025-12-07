import { useScrollAnimation, useCountUp } from "@/hooks/use-scroll-animation";
import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

function SignalStormVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const shouldAnimate = isVisible && !prefersReducedMotion;

  // Orange noise particles - chaotic, spread across canvas
  const noiseParticles = [
    { cx: 8, cy: 15, r: 1.1, dur: "3.2s", rangeX: 4, rangeY: 3 },
    { cx: 15, cy: 28, r: 0.8, dur: "2.8s", rangeX: 3, rangeY: 4 },
    { cx: 22, cy: 18, r: 1.0, dur: "3.5s", rangeX: 5, rangeY: 3 },
    { cx: 12, cy: 38, r: 0.9, dur: "2.6s", rangeX: 4, rangeY: 5 },
    { cx: 5, cy: 48, r: 1.1, dur: "2.9s", rangeX: 4, rangeY: 3 },
    { cx: 18, cy: 58, r: 0.8, dur: "3.3s", rangeX: 5, rangeY: 4 },
    { cx: 10, cy: 68, r: 0.9, dur: "3.1s", rangeX: 4, rangeY: 3 },
    { cx: 6, cy: 78, r: 1.0, dur: "3.4s", rangeX: 5, rangeY: 4 },
    { cx: 20, cy: 85, r: 0.8, dur: "2.8s", rangeX: 4, rangeY: 3 },
    { cx: 28, cy: 22, r: 0.7, dur: "3.0s", rangeX: 3, rangeY: 4 },
    { cx: 35, cy: 35, r: 1.0, dur: "2.7s", rangeX: 4, rangeY: 5 },
    { cx: 30, cy: 48, r: 0.6, dur: "3.0s", rangeX: 3, rangeY: 3 },
    { cx: 38, cy: 55, r: 0.9, dur: "2.9s", rangeX: 4, rangeY: 4 },
    { cx: 32, cy: 65, r: 1.1, dur: "3.2s", rangeX: 5, rangeY: 3 },
    { cx: 42, cy: 42, r: 0.7, dur: "2.6s", rangeX: 3, rangeY: 4 },
    { cx: 36, cy: 75, r: 0.8, dur: "3.1s", rangeX: 4, rangeY: 5 },
    { cx: 45, cy: 32, r: 0.9, dur: "2.7s", rangeX: 5, rangeY: 3 },
    { cx: 40, cy: 18, r: 0.7, dur: "3.3s", rangeX: 3, rangeY: 4 },
  ];

  // Grey signal particles - intermingled with noise, waiting for breakthrough
  const signalParticles = [
    { cx: 25, cy: 45, r: 0.7, dur: "2.5s", rangeX: 3, rangeY: 3 },
    { cx: 48, cy: 52, r: 0.6, dur: "2.8s", rangeX: 4, rangeY: 4 },
    { cx: 33, cy: 62, r: 0.8, dur: "2.3s", rangeX: 3, rangeY: 5 },
    { cx: 55, cy: 38, r: 0.6, dur: "2.6s", rangeX: 4, rangeY: 3 },
    { cx: 42, cy: 72, r: 0.7, dur: "2.4s", rangeX: 3, rangeY: 4 },
    { cx: 58, cy: 55, r: 0.5, dur: "2.7s", rangeX: 4, rangeY: 3 },
    { cx: 50, cy: 28, r: 0.6, dur: "2.9s", rangeX: 3, rangeY: 4 },
    { cx: 62, cy: 45, r: 0.5, dur: "2.2s", rangeX: 3, rangeY: 3 },
    { cx: 38, cy: 25, r: 0.7, dur: "2.5s", rangeX: 4, rangeY: 5 },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative h-80 sm:h-[420px]"
      data-testid="signal-storm-visual"
    >
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Noise gradient for bands */}
          <linearGradient id="noiseGradient1" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ff7a1a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="noiseGradient2" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#ff8c00" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
          </linearGradient>

          {/* Precision beam - ember to white for captured signal */}
          <linearGradient id="precisionBeamGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0" />
            <stop offset="20%" stopColor="#ff7a1a" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#ff7a1a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0.2" />
          </linearGradient>

          {/* Target glow - bright orange with white center */}
          <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#ffb366" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#ff8c00" stopOpacity="0.5" />
            <stop offset="75%" stopColor="#ff7a1a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Enhanced glow for captured signal */}
          <filter id="capturedGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="beamGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle noise bands */}
        <g opacity="0.4">
          <rect x="0" y="30" width="50" height="2" fill="url(#noiseGradient1)" rx="1">
            {shouldAnimate && (
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
            )}
          </rect>
          <rect x="0" y="50" width="45" height="1.5" fill="url(#noiseGradient2)" rx="0.75">
            {shouldAnimate && (
              <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2.5s" repeatCount="indefinite" />
            )}
          </rect>
          <rect x="0" y="70" width="48" height="1.5" fill="url(#noiseGradient1)" rx="0.75">
            {shouldAnimate && (
              <animate attributeName="opacity" values="0.2;0.45;0.2" dur="3s" repeatCount="indefinite" />
            )}
          </rect>
        </g>

        {/* Orange noise particles - chaotic floating motion */}
        <g opacity="0.6">
          {noiseParticles.map((p, i) => (
            <circle 
              key={`noise-${i}`}
              cx={p.cx} 
              cy={p.cy} 
              r={p.r} 
              fill="#ff8c00"
            >
              {shouldAnimate && (
                <>
                  <animate
                    attributeName="cx"
                    values={`${p.cx};${p.cx + p.rangeX};${p.cx - p.rangeX * 0.6};${p.cx + p.rangeX * 0.3};${p.cx}`}
                    dur={p.dur}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${p.cy};${p.cy - p.rangeY * 0.8};${p.cy + p.rangeY};${p.cy - p.rangeY * 0.4};${p.cy}`}
                    dur={p.dur}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.35;0.7;0.25;0.55;0.35"
                    dur={p.dur}
                    repeatCount="indefinite"
                  />
                </>
              )}
            </circle>
          ))}
        </g>

        {/* Grey signal particles - intermingled with noise, waiting for breakthrough */}
        <g opacity="0.7">
          {signalParticles.map((p, i) => (
            <circle 
              key={`signal-${i}`}
              cx={p.cx} 
              cy={p.cy} 
              r={p.r} 
              fill="#aaaaaa"
            >
              {shouldAnimate && (
                <>
                  <animate
                    attributeName="cx"
                    values={`${p.cx};${p.cx + p.rangeX};${p.cx - p.rangeX * 0.5};${p.cx}`}
                    dur={p.dur}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${p.cy};${p.cy - p.rangeY * 0.7};${p.cy + p.rangeY};${p.cy}`}
                    dur={p.dur}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0.75;0.3;0.4"
                    dur={p.dur}
                    repeatCount="indefinite"
                  />
                </>
              )}
            </circle>
          ))}
        </g>

        {/* The precision beam - ember orange to white, leads to captured signal */}
        <g filter="url(#beamGlow)">
          <line
            x1="50"
            y1="50"
            x2="92"
            y2="50"
            stroke="url(#precisionBeamGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {shouldAnimate && (
              <animate
                attributeName="stroke-width"
                values="1.2;2;1.2"
                dur="2.5s"
                repeatCount="indefinite"
              />
            )}
          </line>
          
          {/* Beam core - white hot center */}
          <line
            x1="60"
            y1="50"
            x2="85"
            y2="50"
            stroke="#ffffff"
            strokeWidth="0.6"
            opacity="0.85"
          >
            {shouldAnimate && (
              <animate
                attributeName="opacity"
                values="0.6;0.95;0.6"
                dur="1.8s"
                repeatCount="indefinite"
              />
            )}
          </line>
        </g>

        {/* CAPTURED SIGNAL - The breakthrough with bright orange + white glow */}
        <g filter="url(#capturedGlow)">
          {/* Outer ring - orange */}
          <circle
            cx="85"
            cy="50"
            r="9"
            fill="none"
            stroke="#ff8c00"
            strokeWidth="0.5"
            opacity="0.5"
          >
            {shouldAnimate && (
              <animate attributeName="r" values="9;11;9" dur="2.5s" repeatCount="indefinite" />
            )}
          </circle>
          
          {/* Middle ring - brighter orange */}
          <circle
            cx="85"
            cy="50"
            r="6"
            fill="none"
            stroke="#ff7a1a"
            strokeWidth="0.6"
            opacity="0.6"
          >
            {shouldAnimate && (
              <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite" />
            )}
          </circle>
          
          {/* Inner ring - bright */}
          <circle
            cx="85"
            cy="50"
            r="3.5"
            fill="none"
            stroke="#ffaa55"
            strokeWidth="0.5"
            opacity="0.7"
          />
          
          {/* Target core glow - radial gradient */}
          <circle
            cx="85"
            cy="50"
            r="4"
            fill="url(#targetGlow)"
          />
          
          {/* White-hot center point - the breakthrough */}
          <circle
            cx="85"
            cy="50"
            r="1.8"
            fill="#ffffff"
            opacity="0.95"
          >
            {shouldAnimate && (
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>
      </svg>
      {/* Labels */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
        <div className="w-1.5 h-1.5 rounded-full bg-[#ff8c00]" />
        <span className="font-mono text-[#ff8c00]/80 uppercase tracking-wider text-[18px]">
          Noise
        </span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">
          Signal
        </span>
        <div className="w-2 h-2 rounded-full bg-[#aaaaaa]" />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-center">
        <div className="text-xs text-white/40 font-mono">
          <span className="text-[#ff8c00]/70 text-[18px]">98% noise</span>
          <span className="mx-3 text-white/20">•</span>
          <span className="text-[#ff7a1a] font-bold text-[18px]">1 breakthrough</span>
        </div>
      </div>
    </div>
  );
}

export function AIParadoxSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const { count: impactCount, ref: impactRef } = useCountUp(53);

  return (
    <section 
      ref={ref}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 visible text-[18px]"
      data-testid="ai-paradox-section"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Visual + Key Stat */}
          <div className="flex flex-col justify-center h-full">
            <div className={`animate-on-scroll ${isVisible ? "visible" : ""}`}>
              <SignalStormVisual />
            </div>
            
            {/* Key statistic for visual balance */}
            <div 
              ref={impactRef as React.RefObject<HTMLDivElement>}
              className="basalt-panel p-6 text-center pt-[12px] pb-[12px] mt-[12px] mb-[12px]"
            >
              <div className="sm:text-6xl font-bold text-[#ff963b] text-[52px]">
                {impactCount}%
              </div>
              <p className="text-white/80 mt-2 text-sm sm:text-base">
                of companies see no impact from AI tools
              </p>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className={`flex flex-col justify-center h-full space-y-6 animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
            <Badge variant="symmetri" className="w-fit">The AI Paradox</Badge>
            <h2 className="font-bold leading-[1.3]">
              <span className="text-white text-3xl sm:text-4xl lg:text-[54px] block">AI is the problem.</span>
              <span className="text-ember-gradient text-3xl sm:text-4xl lg:text-[54px] block mt-2 sm:mt-3 lg:mt-4">AI is the solution.</span>
            </h2>
            
            <div className="space-y-4 text-white text-base sm:text-lg leading-relaxed">
              <p className="pt-[0px] pb-[0px]">AI promised speed, scale, and smarter outreach. It delivered noise. Inboxes are full of robotic messages. LinkedIn is a wall of templates. Callers sound like scripts, not people.</p>
              <p>
                Prospects are tired. They ignore almost everything. Yet 80% still expect personalized outreach. The result: a paradox where more technology creates less connection.
              </p>
            </div>
          </div>
        </div>
        
        {/* Transition bridge - ember colors only */}
        <div className="text-center mt-[25px] mb-[25px]">
          <div className="inline-flex items-center gap-3 text-white/40 text-sm">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#ff7a1a]/50 to-transparent" />
            <span className="font-mono text-xs tracking-wide text-[#ff8c00]/70">THE RESULT</span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#ff7a1a]/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
