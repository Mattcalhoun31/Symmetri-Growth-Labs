import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCcw, TrendingUp, UserCheck, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

const signals = [
  { icon: UserCheck, text: "Champion moved to target account", color: "#ff7a1a" },
  { icon: DollarSign, text: "Series B funding announced", color: "#ffaa33" },
  { icon: AlertTriangle, text: "Competitor contract expiring", color: "#ff8c3a" },
];

function DataFlowVisualization() {
  const [activeNode, setActiveNode] = useState(0);
  const [pulsingLines, setPulsingLines] = useState<number[]>([]);
  
  useEffect(() => {
    const nodeInterval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % 6);
    }, 1500);
    
    const lineInterval = setInterval(() => {
      setPulsingLines(prev => {
        const newLines = [...prev, Math.floor(Math.random() * 8)];
        if (newLines.length > 3) newLines.shift();
        return newLines;
      });
    }, 800);
    
    return () => {
      clearInterval(nodeInterval);
      clearInterval(lineInterval);
    };
  }, []);

  const nodes = [
    { x: 50, y: 30, label: "CRM" },
    { x: 150, y: 80, label: "LinkedIn" },
    { x: 250, y: 30, label: "Intent" },
    { x: 350, y: 80, label: "Hiring" },
    { x: 200, y: 150, label: "CORE", isCenter: true },
    { x: 100, y: 200, label: "Verified" },
  ];

  const connections = [
    { from: 0, to: 4 }, { from: 1, to: 4 }, { from: 2, to: 4 }, 
    { from: 3, to: 4 }, { from: 4, to: 5 }
  ];

  return (
    <div className="relative h-72 w-full max-w-md mx-auto">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,122,26,0.2)" />
            <stop offset="50%" stopColor="rgba(255,122,26,0.6)" />
            <stop offset="100%" stopColor="rgba(255,122,26,0.2)" />
          </linearGradient>
        </defs>
        
        {connections.map((conn, i) => {
          const from = nodes[conn.from];
          const to = nodes[conn.to];
          const isPulsing = pulsingLines.includes(i);
          
          return (
            <line 
              key={i}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={isPulsing ? "#ff7a1a" : "rgba(255,122,26,0.2)"}
              strokeWidth={isPulsing ? 2 : 1}
              style={{ transition: "all 0.3s ease" }}
            />
          );
        })}
        
        {nodes.map((node, i) => {
          const isActive = i === activeNode;
          const isCenter = node.isCenter;
          
          return (
            <g key={i}>
              {isActive && !isCenter && (
                <circle 
                  cx={node.x} cy={node.y} r="25"
                  fill="none" stroke="#ff7a1a" strokeWidth="1" opacity="0.5"
                >
                  <animate attributeName="r" values="15;30;15" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle 
                cx={node.x} cy={node.y} 
                r={isCenter ? 30 : 15}
                fill={isCenter ? "url(#centerGrad)" : isActive ? "#ff7a1a" : "rgba(10,10,10,0.8)"}
                stroke={isCenter ? "#ff7a1a" : isActive ? "#ff7a1a" : "rgba(255,122,26,0.3)"}
                strokeWidth={isCenter ? 2 : 1}
                style={{ transition: "all 0.3s ease" }}
              />
              <text 
                x={node.x} 
                y={isCenter ? node.y + 50 : node.y + 30} 
                textAnchor="middle" 
                fill={isActive || isCenter ? "#ff7a1a" : "rgba(255,255,255,0.4)"}
                fontSize="10"
                fontFamily="monospace"
                style={{ transition: "all 0.3s ease" }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
        
        <defs>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,122,26,0.4)" />
            <stop offset="100%" stopColor="rgba(10,10,10,0.9)" />
          </radialGradient>
        </defs>
      </svg>
      
      <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2">
        <Database className="w-6 h-6 text-[#ff7a1a]" />
      </div>
    </div>
  );
}

function SignalStream() {
  const [activeSignal, setActiveSignal] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal(prev => (prev + 1) % signals.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {signals.map((signal, i) => {
        const Icon = signal.icon;
        const isActive = i === activeSignal;
        
        return (
          <div 
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
              isActive 
                ? "bg-white/[0.05] border border-[#ff7a1a]/30" 
                : "bg-white/[0.02] border border-white/5 opacity-50"
            }`}
          >
            <div 
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 ${
                isActive ? "scale-110" : ""
              }`}
              style={{ 
                background: isActive ? `${signal.color}20` : "rgba(255,255,255,0.05)",
                border: `1px solid ${isActive ? signal.color + "50" : "rgba(255,255,255,0.1)"}`
              }}
            >
              <Icon className="w-5 h-5" style={{ color: isActive ? signal.color : "rgba(255,255,255,0.3)" }} />
            </div>
            <div className="flex-1">
              <span className={`text-sm ${isActive ? "text-white" : "text-white/50"}`}>
                {signal.text}
              </span>
            </div>
            {isActive && (
              <CheckCircle className="w-4 h-4 text-green-400 animate-fade-in" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DataEngineSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section 
      ref={ref}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      data-testid="data-engine-section"
    >
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-12 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-6">Living Data</Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Your data is dying.</span>
            <br />
            <span className="text-ember-gradient">Keep it alive.</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            CRM decays 30% yearly. Our self-healing core verifies, enriches, and keeps your accounts accurate 24/7.
          </p>
        </div>
        
        <div className={`flex justify-center gap-8 sm:gap-16 mb-16 animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">150+</div>
            <div className="text-xs text-white/40 mt-1">Data Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#ff7a1a]">24/7</div>
            <div className="text-xs text-white/40 mt-1">Auto-Healing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">2-3×</div>
            <div className="text-xs text-white/40 mt-1">Enrichment Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#ffaa33]">99%</div>
            <div className="text-xs text-white/40 mt-1">Accuracy</div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
            <DataFlowVisualization />
          </div>
          
          <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-300`}>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                We don't guess. <span className="text-ember-gradient">We triangulate.</span>
              </h3>
              <p className="text-sm text-white/50">
                Every signal is cross-referenced against 3+ sources before surfacing to your team.
              </p>
            </div>
            <SignalStream />
            
            <div className="mt-8 p-4 rounded-xl bg-[#ff7a1a]/10 border border-[#ff7a1a]/20">
              <p className="text-sm text-white/80">
                <span className="text-[#ff7a1a] font-bold">Result:</span> Teams see 40% fewer bounced emails and 3x faster lead qualification—without manual data hygiene.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
