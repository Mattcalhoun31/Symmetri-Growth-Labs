import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Bot, Phone, Database } from "lucide-react";

const partnerCards = [
  {
    id: "gtm",
    title: "GTM Strategy",
    icon: Target,
    color: "#ff7a1a",
    description: "We don't guess at your ICP. We map your buying committee, design your motion, and architect a funnel built for how enterprise buyers actually decide.",
  },
  {
    id: "platform",
    title: "Autonomous Outreach Platform",
    icon: Bot,
    color: "#ffaa33",
    description: "AI agents that research, personalize, and deploy—across every channel—without the 6-month ramp time of point solutions.",
  },
  {
    id: "stealth",
    title: "STEALTH™ Calling Methodology",
    icon: Phone,
    color: "#ff8c3a",
    description: "The only AI-resistant cold calling system. 70% fewer hang-ups. 50% more positive responses. Built on real science, not scripts.",
  },
  {
    id: "data",
    title: "Living Data & Signal Core",
    icon: Database,
    color: "#ff7a1a",
    description: "Self-sustaining data infrastructure that heals your CRM automatically. 150+ providers. 2-3x coverage. Zero decay.",
  },
];

export function PartnersSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section 
      ref={ref}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-testid="partners-section"
    >
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Not Just Software.</span>
            <br />
            <span className="text-ember-gradient">Transformation Partners.</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We build, run, and optimize your GTM engine—so you can focus on closing deals.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {partnerCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={card.id}
                className={`basalt-panel ember-edge-glow rounded-xl transition-all duration-300 animate-on-scroll ${isVisible ? "visible" : ""} delay-${(index + 1) * 100}`}
                data-testid={`partner-card-${card.id}`}
              >
                <CardContent className="p-6 relative overflow-hidden">
                  {/* Subtle corner glow */}
                  <div 
                    className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-20 blur-2xl"
                    style={{ background: card.color }}
                  />
                  <div 
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ 
                      backgroundColor: `${card.color}15`,
                      border: `1px solid ${card.color}30`
                    }}
                  >
                    <Icon 
                      className="w-6 h-6"
                      style={{ color: card.color }}
                    />
                  </div>
                  <h3 className="relative text-lg font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="relative text-white/70 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
