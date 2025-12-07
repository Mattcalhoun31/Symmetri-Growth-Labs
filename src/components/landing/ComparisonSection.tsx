import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check, Clock, Zap, Users, Bot, Target, MessageSquare, TrendingDown, TrendingUp } from "lucide-react";

const manualPlaybooks = [
  { text: "Spray-and-pray emails", icon: X },
  { text: "3–7 day research cycles", icon: Clock },
  { text: "SDRs buried in tabs and tools", icon: Users },
  { text: "Little to no ABM execution", icon: Target },
  { text: "Burnout and high turnover", icon: TrendingDown },
];

const agenticOperations = [
  { text: "Signal-driven targeting", icon: Zap },
  { text: 'Real-time "next best action"', icon: Bot },
  { text: "Agents handle research + follow-up", icon: MessageSquare },
  { text: "ABM and outbound from one Engine", icon: Target },
  { text: "SDRs focused on real conversations", icon: TrendingUp },
];

export function ComparisonSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section 
      ref={ref}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-testid="comparison-section"
    >
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-white">Old Playbooks vs. New </span>
            <span className="text-ember-gradient">Agentic Playbooks</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <Card className={`basalt-panel animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white/70 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                Manual Playbooks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {manualPlaybooks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.text}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <Icon className="w-5 h-5 text-red-400/60 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          <Card className={`basalt-panel ember-edge-glow border-[#FF8C00]/20 animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-symmetri-orange/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-symmetri-orange" />
                </div>
                Agentic Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agenticOperations.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.text}
                    className="flex items-center gap-3 text-white"
                  >
                    <Icon className="w-5 h-5 text-symmetri-orange shrink-0" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
