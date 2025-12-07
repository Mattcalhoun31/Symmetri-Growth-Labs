import { useScrollAnimation, useInViewport } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";
import { 
  ArrowRight,
  Database, 
  Bot, 
  Phone, 
  Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SymmetriContinuum } from "./SymmetriContinuum";

const modules = [
  { icon: Database, title: "Self-Sustaining Data Infrastructure", desc: "150+ data providers. Auto-healing. Zero decay.", color: "#ff7a1a", metric: "150+ providers" },
  { icon: Bot, title: "Autonomous Multi-Agent Outreach", desc: "AI agents that research, generate, and deploy across every channel.", color: "#ff8c3a", metric: "Multi-channel" },
  { icon: Phone, title: "S.T.E.A.L.T.H.™ Human Performance System", desc: "Elite coaching that makes your reps AI-resistant. 1-hour daily co-execution.", color: "#ffaa33", featured: true, metric: "AI-resistant" },
  { icon: Target, title: "GTM Strategy & Control Room", desc: "Real-time visibility. Unified pipeline. Zero blind spots.", color: "#ff7a1a", metric: "Full visibility" },
];

const chaosElements = [
  "CRM decay: 30% of your data is wrong",
  "5-10 tools that don't talk to each other",
  "Hours wasted on LinkedIn stalking", 
  "High turnover, inconsistent performance",
  "Templates that sound like every competitor",
];

const symmetryElements = [
  "Self-healing CRM with 150+ sources",
  "One system, one truth",
  "AI that executes, not just suggests",
  "Performance improves automatically",
  "Right message, right person, right time",
];

function TransformationVisual() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % chaosElements.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-16">
        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a1a]/10 to-transparent rounded-2xl blur-xl" />
          <div className="mb-2">
            <div className="px-2 py-1 rounded bg-black/50 border border-white/10 inline-block">
              <span className="text-[10px] font-mono text-white/60 tracking-widest">CHAOS</span>
            </div>
          </div>
          <div className="relative space-y-2">
            {chaosElements.map((item, i) => (
              <div 
                key={i}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-500 ${
                  i === activeIndex 
                    ? "bg-[#ff7a1a]/20 border border-[#ff7a1a]/30 scale-105" 
                    : "bg-white/[0.02] opacity-40"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${i === activeIndex ? "bg-[#ff7a1a]" : "bg-white/20"}`} />
                <span className={`text-sm ${i === activeIndex ? "text-[#ff7a1a] line-through" : "text-white/40"}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center gap-2">
          <div className="w-24 h-px bg-gradient-to-r from-[#ff7a1a]/50 via-[#FF8C00] to-[#ffaa33]" />
          <div className="px-4 py-2 rounded-full border border-[#ff7a1a]/40 bg-[#0a0a0a]/80">
            <span className="text-xs font-mono text-[#7a7474f2]">TRANSFORM</span>
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-[#ff7a1a]/50 via-[#FF8C00] to-[#ffaa33]" />
        </div>

        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-0 bg-gradient-to-l from-[#ff7a1a]/10 to-transparent rounded-2xl blur-xl" />
          <div className="mb-2 text-right">
            <div className="px-2 py-1 rounded bg-black/50 border border-white/10 inline-block">
              <span className="text-[10px] font-mono text-white/60 tracking-widest">SYMMETRI</span>
            </div>
          </div>
          <div className="relative space-y-2">
            {symmetryElements.map((item, i) => (
              <div 
                key={i}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-500 ${
                  i === activeIndex 
                    ? "bg-[#ff7a1a]/20 border border-[#ff7a1a]/40 scale-105" 
                    : "bg-white/[0.02] opacity-60"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  i === activeIndex 
                    ? "bg-[#ff7a1a] shadow-[0_0_8px_rgba(255,122,26,0.8)]" 
                    : "bg-[#ff7a1a]/40"
                }`} />
                <span className={`text-sm ${i === activeIndex ? "text-white font-medium" : "text-white/70"}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {modules.map((module, i) => {
        const Icon = module.icon;
        const isFeatured = 'featured' in module && module.featured;
        return (
          <div 
            key={i}
            className={`group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
              isFeatured 
                ? "bg-[#ff7a1a]/10 border-2 border-[#ff7a1a]/50 shadow-[0_0_20px_rgba(255,122,26,0.15)]" 
                : "bg-white/[0.02] border border-white/5 hover:border-[#ff7a1a]/30"
            }`}
          >
            <div 
              className={`rounded-lg flex items-center justify-center flex-shrink-0 ${isFeatured ? "w-12 h-12" : "w-10 h-10"}`}
              style={{ 
                background: isFeatured 
                  ? `linear-gradient(135deg, ${module.color}40, ${module.color}20)` 
                  : `linear-gradient(135deg, ${module.color}20, ${module.color}10)`,
                border: `1px solid ${module.color}${isFeatured ? '60' : '30'}`,
                boxShadow: isFeatured ? `0 0 12px ${module.color}40` : 'none'
              }}
            >
              <Icon className={isFeatured ? "w-6 h-6" : "w-5 h-5"} style={{ color: module.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-white ${isFeatured ? "text-sm" : "text-sm"}`}>{module.title}</div>
              <div className={`text-xs ${isFeatured ? "text-white/70" : "text-white/50"}`}>{module.desc}</div>
              {'metric' in module && module.metric && (
                <div 
                  className="text-[10px] font-mono mt-1.5 px-2 py-0.5 rounded-full inline-block"
                  style={{ 
                    backgroundColor: `${module.color}15`,
                    color: module.color
                  }}
                >
                  {module.metric}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RevenueOSSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const { ref: viewportRef, inViewport } = useInViewport<HTMLDivElement>(0.1);

  return (
    <section 
      ref={ref}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      data-testid="revenue-os-section"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(255,122,26,0.2) 0%, transparent 50%)",
          }}
        />
      </div>
      <div ref={viewportRef} className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-6 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-6">The solution</Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">The </span>
            <span className="text-ember-gradient">GTM Transformation Stack</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-[20px] font-normal">
            Four integrated pillars. One unified revenue engine. We don't sell software—we deliver outcomes.
          </p>
        </div>

        <div className={`mb-6 animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}>
          <ModuleStrip />
        </div>
        
        <div className={`flex justify-center gap-8 sm:gap-16 mb-12 animate-on-scroll ${isVisible ? "visible" : ""} delay-150`}>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">70%</div>
            <div className="text-xs text-white/40 mt-1">Improvement in<br />Answer Rates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#ff7a1a]">50%</div>
            <div className="text-xs text-white/40 mt-1">Reduction in<br />Spam Flags</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#ffaa33]">35%+</div>
            <div className="text-xs text-white/40 mt-1">More Meetings<br />Booked</div>
          </div>
        </div>

        <div className={`mb-16 animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
          <SymmetriContinuum isVisible={inViewport} size="lg" showLabels={true} />
        </div>

        <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-300`}>
          <TransformationVisual />
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-white/40 mb-3">The Engine is always scanning...</p>
          <ArrowRight className="w-5 h-5 text-[#ff7a1a]/60 mx-auto animate-bounce" style={{ animationDuration: "2s" }} />
        </div>
      </div>
    </section>
  );
}
