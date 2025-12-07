import { useState } from "react";
import { Database, Bot, Phone, Target, Zap } from "lucide-react";

interface Module {
  id: string;
  title: string;
  icon: typeof Database;
  microLabel: string;
  position: { angle: number; distance: number };
  color: string;
}

const modules: Module[] = [
  {
    id: "data",
    title: "Living Data & Signal Core",
    icon: Database,
    microLabel: "ABM account maps",
    position: { angle: 0, distance: 140 },
    color: "#ff7a1a",
  },
  {
    id: "agents",
    title: "Autonomous Multi-Agent Platform",
    icon: Bot,
    microLabel: "Persona-level research",
    position: { angle: 90, distance: 140 },
    color: "#ffaa33",
  },
  {
    id: "stealth",
    title: "STEALTH™ Calling Layer",
    icon: Phone,
    microLabel: "Spam-safe call flows",
    position: { angle: 180, distance: 140 },
    color: "#ff8c3a",
  },
  {
    id: "gtm",
    title: "GTM Strategy & Control Room",
    icon: Target,
    microLabel: "Next Best Action",
    position: { angle: 270, distance: 140 },
    color: "#ff7a1a",
  },
];

interface OSDiagramProps {
  className?: string;
  compact?: boolean;
}

export function OSDiagram({ className = "", compact = false }: OSDiagramProps) {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const size = compact ? 280 : 380;
  const center = size / 2;
  const coreSize = compact ? 80 : 100;
  const moduleSize = compact ? 100 : 130;

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
      data-testid="os-diagram"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
      >
        {modules.map((module, index) => {
          const radians = (module.position.angle * Math.PI) / 180;
          const distance = compact ? module.position.distance * 0.7 : module.position.distance;
          const coreRadius = coreSize / 2;
          const startX = center + Math.cos(radians) * coreRadius;
          const startY = center + Math.sin(radians) * coreRadius;
          const x = center + Math.cos(radians) * distance;
          const y = center + Math.sin(radians) * distance;
          
          return (
            <g key={module.id}>
              <line
                x1={startX}
                y1={startY}
                x2={x}
                y2={y}
                stroke="rgba(255, 122, 26, 0.3)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle
                cx={center + Math.cos(radians) * (coreRadius + (distance - coreRadius) * 0.4 + (index * 15) % 40)}
                cy={center + Math.sin(radians) * (coreRadius + (distance - coreRadius) * 0.4 + (index * 15) % 40)}
                r="3"
                fill="#ff7a1a"
                className="animate-pulse"
                style={{ animationDelay: `${index * 0.5}s` }}
              />
            </g>
          );
        })}
      </svg>

      <div
        className="absolute pulse-core rounded-full bg-gradient-to-br from-symmetri-orange/20 to-symmetri-orange/5 border-2 border-symmetri-orange/50 flex items-center justify-center"
        style={{
          width: coreSize,
          height: coreSize,
          left: center - coreSize / 2,
          top: center - coreSize / 2,
        }}
      >
        <div className="text-center">
          <Zap className="w-6 h-6 text-symmetri-orange mx-auto mb-1" />
          <span className={`text-white font-bold ${compact ? "text-[8px]" : "text-[10px]"} leading-tight block`}>
            GTM
          </span>
          <span className={`text-symmetri-orange font-bold ${compact ? "text-[8px]" : "text-[10px]"} leading-tight block`}>
            Engine
          </span>
        </div>
      </div>

      {modules.map((module) => {
        const radians = (module.position.angle * Math.PI) / 180;
        const distance = compact ? module.position.distance * 0.7 : module.position.distance;
        const x = center + Math.cos(radians) * distance;
        const y = center + Math.sin(radians) * distance;
        const Icon = module.icon;
        const isHovered = hoveredModule === module.id;
        
        return (
          <div
            key={module.id}
            className={`absolute transition-all duration-300 ${
              isHovered ? "scale-110 z-10" : "scale-100"
            }`}
            style={{
              left: x - moduleSize / 2,
              top: y - moduleSize / 2,
              width: moduleSize,
              height: moduleSize,
            }}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
          >
            <div
              className={`w-full h-full basalt-panel transition-all duration-300 p-2 flex flex-col items-center justify-center text-center ${
                isHovered
                  ? "border-symmetri-orange/60 shadow-lg shadow-symmetri-orange/20"
                  : "border-border/50"
              }`}
              style={{
                boxShadow: isHovered
                  ? `0 0 20px ${module.color}40`
                  : undefined,
              }}
            >
              <Icon
                className="mb-1"
                style={{ 
                  color: module.color,
                  width: compact ? 16 : 20,
                  height: compact ? 16 : 20,
                }}
              />
              <span className={`text-white font-medium leading-tight block ${compact ? "text-[8px]" : "text-[10px]"}`}>
                {module.title}
              </span>
              {isHovered && (
                <span 
                  className={`mt-1 text-muted-foreground ${compact ? "text-[7px]" : "text-[9px]"}`}
                  style={{ color: module.color }}
                >
                  {module.microLabel}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
