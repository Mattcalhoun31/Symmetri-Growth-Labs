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

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  isDecimal?: boolean;
}

function CollapseStatCard({ value, suffix, label, isDecimal }: StatCardProps) {
  const { count, ref } = useCountUp(isDecimal ? value * 10 : value);
  const displayValue = isDecimal ? (count / 10).toFixed(1) : count;
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="basalt-panel p-4 text-center"
    >
      <div className="text-3xl sm:text-4xl font-bold text-[#ff832b]">
        {displayValue}{suffix}
      </div>
      <p className="text-white/80 mt-2 text-xs sm:text-sm">{label}</p>
    </div>
  );
}

function CollapseTypographyVisual() {
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

  const letters = [
    { char: "C", rotate: 0, y: 0, opacity: 1 },
    { char: "O", rotate: -2, y: 2, opacity: 0.95 },
    { char: "L", rotate: -5, y: 8, opacity: 0.85 },
    { char: "L", rotate: -12, y: 20, opacity: 0.7 },
    { char: "A", rotate: -25, y: 40, opacity: 0.5 },
    { char: "P", rotate: -45, y: 70, opacity: 0.35 },
    { char: "S", rotate: -70, y: 110, opacity: 0.2 },
    { char: "E", rotate: -90, y: 160, opacity: 0.1 },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative h-80 sm:h-[420px] flex items-center justify-center overflow-hidden"
      data-testid="collapse-typography-visual"
    >
      {/* Subtle diagnostic frame */}
      <div className="absolute inset-4 border border-[#ff8c00]/10 rounded-lg" />
      
      {/* Alert indicator */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse" />
        <span className="text-[10px] font-mono text-[#ff8c00]/70 uppercase tracking-widest">
          System Alert
        </span>
      </div>

      {/* Main typography lockup */}
      <div className="relative flex items-start">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold font-mono select-none"
            style={{
              color: `rgba(255, 140, 0, ${letter.opacity})`,
              transform: `translateY(${letter.y}px) rotate(${letter.rotate}deg)`,
              transformOrigin: "top center",
              textShadow: letter.opacity > 0.5 
                ? `0 0 30px rgba(255, 122, 26, ${letter.opacity * 0.5})` 
                : "none",
              transition: prefersReducedMotion ? "none" : "transform 0.3s ease-out",
              filter: letter.opacity < 0.5 ? `blur(${(1 - letter.opacity) * 2}px)` : "none",
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>

      {/* Falling debris - small letter fragments */}
      <div className="absolute bottom-20 right-1/4 text-2xl font-mono text-[#e65c00]/20 rotate-45">
        E
      </div>
      <div className="absolute bottom-16 right-1/3 text-lg font-mono text-[#e65c00]/15 -rotate-30">
        S
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-white/30 uppercase">
            Pipeline Status
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[30%] bg-gradient-to-r from-[#ff8c00] to-[#e65c00] rounded-full" />
            </div>
            <span className="text-xs font-mono text-[#ff8c00]">-47%</span>
          </div>
        </div>
        
        <div className="text-right space-y-1">
          <div className="text-[10px] font-mono text-white/30 uppercase">
            Win Rate
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs font-mono text-[#ff7a1a]">-32%</span>
            <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[25%] bg-gradient-to-r from-[#ff7a1a] to-[#e65c00] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="text-[10px] font-mono text-white/20">
          GTM 2023-2025
        </span>
      </div>
    </div>
  );
}

export function GTMCollapseSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section 
      ref={ref}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 visible pt-[68px] pb-[68px]"
      data-testid="gtm-collapse-section"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content and Stats */}
          <div className="space-y-8">
            <div className={`animate-on-scroll ${isVisible ? "visible" : ""}`}>
              <Badge variant="symmetri" className="w-fit mb-4">Why We Exist</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-white">The 2025 </span>
                <span className="text-ember-gradient">GTM Collapse</span>
              </h2>
              
              <ul className="space-y-4 text-white text-base sm:text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-symmetri-orange mt-1.5 text-xl">•</span>
                  <span>SDRs now need hundreds of touches to book a single meeting.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-symmetri-orange mt-1.5 text-xl">•</span>
                  <span>CRM data decays so fast that most "target lists" are already wrong.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-symmetri-orange mt-1.5 text-xl">•</span>
                  <span>ABM plans never reach their full potential because the data and outreach can't keep up.</span>
                </li>
              </ul>
            </div>
            
            {/* Stats */}
            <div className={`grid grid-cols-3 gap-4 animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
              <CollapseStatCard value={2} suffix="%" label="Average success rate of cold calls" />
              <CollapseStatCard value={0.2} suffix="%" label="Average success rate of cold emails" isDecimal />
              <CollapseStatCard value={80} suffix="%" label="Decision Makers expect personalization" />
            </div>
          </div>
          
          {/* Right side - Typography Collapse Visual */}
          <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}>
            <CollapseTypographyVisual />
          </div>
        </div>
        
        {/* Transition bridge */}
        <div className="mt-16 text-center">
          <p className="text-white/50 text-sm mb-3">Point solutions created this mess. Only a system can fix it.</p>
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#ff7a1a]/50 to-[#ff7a1a]" />
            <span className="text-xs font-mono text-[#ff7a1a] tracking-widest">ENTER THE ENGINE</span>
            <div className="w-12 h-px bg-gradient-to-r from-[#ff7a1a] via-[#ff7a1a]/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
