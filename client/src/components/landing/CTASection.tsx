import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Play } from "lucide-react";

interface CTASectionProps {
  onBookSession: () => void;
  onWalkthrough: () => void;
}

export function CTASection({ onBookSession, onWalkthrough }: CTASectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section 
      ref={ref}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      data-testid="cta-section"
    >
      {/* Full symmetry achieved - perfectly aligned grid with radiant core */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Perfectly aligned, unified grid - symmetry achieved */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,140,0,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,140,0,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radiant symmetrical glow from center */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(255,122,26,0.4) 0%, transparent 70%)",
          }}
        />
        {/* Concentric rings of symmetry */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 border border-[#ff8c00]/20"
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 border border-[#ff8c00]/30"
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full opacity-20 border border-[#ff8c00]/40"
        />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className={`text-center animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-6">30-Day Activation</Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Ready to build pipeline</span>
            <br />
            <span className="text-ember-gradient">on autopilot?</span>
          </h2>
          
          <p className="text-xl text-white max-w-2xl mx-auto mb-10">
            Get a 30-day activation plan that shows exactly how a Revenue Engine, STEALTH™, and ABM-ready data engine can work for your team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#FF6600] to-[#FF4400] hover:from-[#FF5500] hover:to-[#FF3300] text-white font-bold px-8 py-6 text-lg gap-2 glow-bioluminescent"
              onClick={() => window.open("https://calendar.app.google/tXjMUnVvDC4i8vq57", "_blank")}
              data-testid="button-book-session"
            >
              <Zap className="w-5 h-5" />
              Get Your Free GTM Diagnostic
            </Button>
          </div>
          
          <p className="text-sm text-white/60 max-w-lg mx-auto">
            See your projected revenue in 60 seconds. No pressure, just data.
          </p>
        </div>
      </div>
    </section>
  );
}
