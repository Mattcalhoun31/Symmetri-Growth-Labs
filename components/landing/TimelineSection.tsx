import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Target, 
  Database, 
  Bot, 
  Phone, 
  TrendingUp 
} from "lucide-react";

const phases = [
  {
    id: 1,
    phase: "Phase 1",
    title: "GTM Diagnostic",
    timing: "Week 1-2",
    description: "Complete audit of your ICP, data, process, team, and tech. No assumptions—just clarity.",
    deliverable: "GTM Transformation Roadmap",
    icon: Search,
    isOrangeCard: false,
  },
  {
    id: 2,
    phase: "Phase 2",
    title: "Strategy & Design",
    timing: "Week 2-3",
    description: "We design your GTM motion—targets, offers, sequences, buying committee maps.",
    deliverable: "GTM Playbook",
    icon: Target,
    isOrangeCard: true,
  },
  {
    id: 3,
    phase: "Phase 3",
    title: "Infrastructure Build",
    timing: "Week 3-6",
    description: "Clay-based data engine. CallSine configuration. Mailbox setup. CRM integration.",
    deliverable: "Operational Data Infrastructure",
    icon: Database,
    isOrangeCard: false,
  },
  {
    id: 4,
    phase: "Phase 4",
    title: "Agent Activation",
    timing: "Week 4-6",
    description: "Configure agents that research, generate, and deploy across every channel.",
    deliverable: "Live Multi-Agent System",
    icon: Bot,
    isOrangeCard: true,
  },
  {
    id: 5,
    phase: "Phase 5",
    title: "S.T.E.A.L.T.H.™ Activation",
    timing: "Week 4-8",
    description: "1-hour daily co-execution. Tell, show, shadow, co-execute.",
    deliverable: "Certified High-Performers",
    icon: Phone,
    isOrangeCard: false,
  },
  {
    id: 6,
    phase: "Phase 6",
    title: "Optimization",
    timing: "Ongoing",
    description: "Weekly reviews. Monthly coaching. Quarterly strategy updates.",
    deliverable: "Predictable Pipeline Growth",
    icon: TrendingUp,
    isOrangeCard: true,
  },
];

export function TimelineSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section 
      ref={ref}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-testid="timeline-section"
    >
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-6">Implementation</Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">From Diagnostic to </span>
            <span className="text-ember-gradient">Domination</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
            A proven 60-day transformation with clear milestones and measurable outcomes. 
            We don't just hand you software—we build and run the system with you.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF8C00]/50 via-[#ffaa33]/40 to-[#FF8C00]/50 md:-translate-x-0.5" />
          <div className="absolute left-4 md:left-1/2 top-0 w-0.5 h-full timeline-spine md:-translate-x-0.5" />
          
          <div className="space-y-8">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isLeft = index % 2 === 0;
              
              return (
                <div 
                  key={phase.id}
                  className={`relative flex items-start gap-6 md:gap-0 animate-on-scroll ${isVisible ? "visible" : ""} delay-${Math.min(index * 100, 700)}`}
                  data-testid={`timeline-phase-${phase.id}`}
                >
                  <div 
                    className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full border-2 -translate-x-1/2 z-10"
                    style={{ 
                      backgroundColor: phase.isOrangeCard ? "#FF8C00" : "rgba(255, 255, 255, 0.3)",
                      borderColor: phase.isOrangeCard ? "#FF8C00" : "rgba(255, 255, 255, 0.4)",
                      boxShadow: phase.isOrangeCard ? "0 0 10px #FF8C00" : "0 0 6px rgba(255, 255, 255, 0.2)",
                    }}
                  />
                  
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"}`}>
                    <Card 
                      className={`rounded-xl ${
                        phase.isOrangeCard 
                          ? "bg-gradient-to-br from-[#FF8C00] to-[#E65C00] border-[#FF8C00]/40" 
                          : "basalt-panel"
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className={`flex items-start gap-4 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                          <div 
                            className={`p-2.5 rounded-lg shrink-0 ${
                              phase.isOrangeCard ? "bg-black/20" : "bg-white/10"
                            }`}
                          >
                            <Icon 
                              className={`w-5 h-5 ${
                                phase.isOrangeCard ? "text-white" : "text-white/70"
                              }`}
                            />
                          </div>
                          <div className={isLeft ? "md:text-right" : ""}>
                            <div className={`flex items-center gap-2 mb-1 ${isLeft ? "md:justify-end" : ""}`}>
                              <span 
                                className={`text-xs font-bold px-2 py-0.5 rounded ${
                                  phase.isOrangeCard 
                                    ? "bg-black/20 text-white" 
                                    : "bg-white/10 text-white/60"
                                }`}
                              >
                                {phase.phase}
                              </span>
                              <span className={`text-xs ${phase.isOrangeCard ? "text-white/70" : "text-white/40"}`}>
                                {phase.timing}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                              {phase.title}
                            </h3>
                            <p className={`text-sm leading-relaxed mb-3 ${
                              phase.isOrangeCard ? "text-white/90" : "text-white/80"
                            }`}>
                              {phase.description}
                            </p>
                            <div 
                              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                                phase.isOrangeCard 
                                  ? "bg-black/30 text-white" 
                                  : "bg-[#FF8C00]/20 text-[#FF8C00]"
                              }`}
                            >
                              <span>Deliverable:</span>
                              <span className="font-bold">{phase.deliverable}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
