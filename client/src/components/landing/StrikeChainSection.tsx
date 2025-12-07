import { useScrollAnimation, useCountUp } from "@/hooks/use-scroll-animation";
import { Crosshair, Shield, Target, Zap, CheckCircle, Activity, TrendingUp, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: 147, suffix: "k", label: "Signals/day", icon: Activity },
  { value: 0.8, suffix: "s", label: "Response", icon: Zap, isDecimal: true },
  { value: 99, suffix: "%", label: "Accuracy", icon: CheckCircle },
  { value: 3.2, suffix: "×", label: "Lift", icon: TrendingUp, isDecimal: true },
];

const phases = [
  {
    id: 1,
    phase: "DETECT",
    title: "Signal Capture",
    icon: Crosshair,
    color: "#ff7a1a",
    desc: "Lock onto high-intent accounts using hiring, funding, and engagement signals.",
    signals: ["Hiring VP Sales", "Series B Funded", "Tech Stack Change"]
  },
  {
    id: 2,
    phase: "DECIDE", 
    title: "Multi-Thread Outreach",
    icon: Shield,
    color: "#ff8c3a",
    desc: "Surround the buying committee across email, LinkedIn, and phone.",
    signals: ["Score: 94.2", "Multi-thread", "Timing optimal"]
  },
  {
    id: 3,
    phase: "DEPLOY",
    title: "Meeting Conversion",
    icon: Target,
    color: "#ffaa33",
    desc: "Trigger actions that lead to meetings and deals—not random check-ins.",
    signals: ["Email sent", "LinkedIn queued", "Call scheduled"]
  },
];

function RadarVisualization() {
  const [scanAngle, setScanAngle] = useState(0);
  const [activeBlips, setActiveBlips] = useState<number[]>([0, 2, 4]);
  
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanAngle(prev => (prev + 2) % 360);
    }, 50);
    
    const blipInterval = setInterval(() => {
      setActiveBlips(prev => {
        const newBlips = [...prev];
        const randomIndex = Math.floor(Math.random() * 6);
        if (newBlips.includes(randomIndex)) {
          newBlips.splice(newBlips.indexOf(randomIndex), 1);
        } else if (newBlips.length < 4) {
          newBlips.push(randomIndex);
        }
        return newBlips;
      });
    }, 1500);
    
    return () => {
      clearInterval(scanInterval);
      clearInterval(blipInterval);
    };
  }, []);

  const blipPositions = [
    { x: 30, y: 25, color: "#ff7a1a" },     // Orange
    { x: 70, y: 20, color: "#ff8c3a" },     // Orange variant
    { x: 80, y: 50, color: "#ef4444" },     // Red
    { x: 65, y: 75, color: "#ffffff" },     // White
    { x: 25, y: 70, color: "#ffaa33" },     // Orange/Yellow
    { x: 20, y: 45, color: "#fbbf24" }      // Yellow
  ];

  return (
    <div className="relative aspect-square max-w-lg mx-auto">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,122,26,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,170,51,0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        
        <circle cx="200" cy="200" r="180" fill="url(#radarGlow)" />
        <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255,122,26,0.2)" strokeWidth="1" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,122,26,0.15)" strokeWidth="1" />
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,122,26,0.1)" strokeWidth="1" />
        
        <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(255,122,26,0.1)" strokeWidth="1" />
        <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(255,122,26,0.1)" strokeWidth="1" />
        
        <g transform={`rotate(${scanAngle}, 200, 200)`}>
          <path
            d="M 200 200 L 200 20 A 180 180 0 0 1 380 200 Z"
            fill="url(#scanGradient)"
            opacity="0.3"
          />
          <line x1="200" y1="200" x2="200" y2="20" stroke="#ffaa33" strokeWidth="2" />
        </g>
      </svg>
      
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff7a1a]/30 to-[#0a0a0a] border border-[#ff7a1a]/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,122,26,0.3)]">
          <Crosshair className="w-7 h-7 text-[#ff7a1a]" />
        </div>
      </div>
      
      {blipPositions.map((pos, i) => (
        <div
          key={i}
          className={`absolute transition-all duration-500 ${activeBlips.includes(i) ? "opacity-100" : "opacity-20"}`}
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="relative">
            {activeBlips.includes(i) && (
              <div 
                className="absolute inset-0 -m-2 rounded-full animate-ping" 
                style={{ 
                  animationDuration: "2s",
                  backgroundColor: `${pos.color}30`
                }} 
              />
            )}
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: activeBlips.includes(i) ? pos.color : "rgba(255,255,255,0.2)",
                boxShadow: activeBlips.includes(i) ? `0 0 12px ${pos.color}cc` : "none"
              }}
            />
          </div>
        </div>
      ))}
      
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-pulse" />
        <span className="text-xs font-mono text-[#ff7a1a]">SCANNING</span>
      </div>
      <div className="absolute top-4 right-4 text-xs font-mono text-white/40">
        {activeBlips.length} targets
      </div>
    </div>
  );
}

function PhaseTimeline({ isVisible }: { isVisible: boolean }) {
  const [activePhase, setActivePhase] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {phases.map((phase, i) => {
        const Icon = phase.icon;
        const isActive = i === activePhase;
        
        return (
          <div 
            key={phase.id}
            className={`relative animate-on-scroll ${isVisible ? "visible" : ""} delay-${(i + 1) * 100}`}
          >
            <div className={`relative p-5 rounded-xl transition-all duration-500 ${
              isActive 
                ? "bg-white/[0.04] border border-[#ff7a1a]/30" 
                : "bg-white/[0.02] border border-white/5"
            }`}>
              <div className="flex items-start gap-4">
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isActive ? "scale-110" : ""}`}
                  style={{ 
                    background: `linear-gradient(135deg, ${phase.color}20, ${phase.color}05)`,
                    border: `1px solid ${phase.color}30`,
                    boxShadow: isActive ? `0 0 20px ${phase.color}30` : "none"
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: phase.color }} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono tracking-widest" style={{ color: phase.color }}>
                      {phase.phase}
                    </span>
                    <span className="text-sm font-bold text-white">{phase.title}</span>
                  </div>
                  <p className={`text-sm transition-all duration-300 ${isActive ? "text-white/70" : "text-white/40"}`}>
                    {phase.desc}
                  </p>
                </div>
              </div>
            </div>
            
            {i < phases.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowRight className={`w-4 h-4 rotate-90 transition-colors duration-300 ${
                  i < activePhase ? "text-[#ff7a1a]" : "text-white/20"
                }`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatStrip({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={`flex justify-center animate-on-scroll ${isVisible ? "visible" : ""}`}>
      <div className="inline-flex items-center gap-6 sm:gap-10 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
        {stats.map((stat, i) => {
          const { count, ref } = useCountUp(stat.isDecimal ? stat.value * 10 : stat.value);
          const Icon = stat.icon;
          const displayValue = stat.isDecimal ? (count / 10).toFixed(1) : count;
          
          return (
            <div 
              key={i}
              ref={ref as React.RefObject<HTMLDivElement>}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span className="text-lg sm:text-xl font-bold text-white">
                  {displayValue}{stat.suffix}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-white/40">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StrikeChainSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section 
      ref={ref}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      data-testid="strike-chain-section"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-12 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-6">Signal Intelligence</Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">The </span>
            <span className="text-ember-gradient">Strike Chain</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Signal to action in under a second. Your Engine detects, decides, and deploys while competitors are still checking email.
          </p>
        </div>
        
        <div className={`mb-12 animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}>
          <StatStrip isVisible={isVisible} />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
            <RadarVisualization />
          </div>
          
          <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-300`}>
            <PhaseTimeline isVisible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}
