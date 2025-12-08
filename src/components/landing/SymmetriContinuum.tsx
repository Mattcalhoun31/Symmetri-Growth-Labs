import { useState, useEffect, useMemo, useCallback } from "react";

interface Particle {
  id: number;
  angle: number;
  speed: number;
  layer: number;
  size: number;
  opacity: number;
}

interface PulseRing {
  id: number;
  progress: number;
  opacity: number;
}

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  
  return prefersReducedMotion;
}

interface SymmetriContinuumProps {
  isVisible: boolean;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

export function SymmetriContinuum({ 
  isVisible, 
  size = "md",
  showLabels = true 
}: SymmetriContinuumProps) {
  const prefersReducedMotion = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulseRings, setPulseRings] = useState<PulseRing[]>([]);
  
  const sizeClasses = {
    sm: "w-64 h-64",
    md: "w-80 h-80 sm:w-96 sm:h-96",
    lg: "w-96 h-96 sm:w-[28rem] sm:h-[28rem] lg:w-[32rem] lg:h-[32rem]"
  };

  const particles = useMemo(() => {
    const particleList: Particle[] = [];
    for (let layer = 0; layer < 3; layer++) {
      const count = 12 + layer * 4;
      for (let i = 0; i < count; i++) {
        particleList.push({
          id: layer * 100 + i,
          angle: (i / count) * 360 + Math.random() * 30,
          speed: 0.3 + Math.random() * 0.4 + layer * 0.1,
          layer,
          size: 2 + Math.random() * 2 - layer * 0.3,
          opacity: 0.6 + Math.random() * 0.4 - layer * 0.15,
        });
      }
    }
    return particleList;
  }, []);

  const [particleAngles, setParticleAngles] = useState<number[]>(() => 
    particles.map(p => p.angle)
  );

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360);
      setParticleAngles(prev => 
        prev.map((angle, i) => (angle + particles[i].speed) % 360)
      );
    }, 16);
    
    return () => clearInterval(interval);
  }, [isVisible, prefersReducedMotion, particles]);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;
    
    const pulseInterval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(pulseInterval);
  }, [isVisible, prefersReducedMotion]);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;
    
    const ringInterval = setInterval(() => {
      setPulseRings(prev => {
        const updated = prev
          .map(ring => ({
            ...ring,
            progress: ring.progress + 2,
            opacity: Math.max(0, ring.opacity - 0.02)
          }))
          .filter(ring => ring.opacity > 0);
        
        if (updated.length < 3 && Math.random() > 0.7) {
          updated.push({
            id: Date.now(),
            progress: 0,
            opacity: 0.6
          });
        }
        
        return updated;
      });
    }, 50);
    
    return () => clearInterval(ringInterval);
  }, [isVisible, prefersReducedMotion]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
  }, []);

  const torusLayers = [
    { radius: 120, thickness: 30, color: "#ff8c00", zIndex: 3, blur: 0 },
    { radius: 100, thickness: 24, color: "#ff6600", zIndex: 2, blur: 0.5 },
    { radius: 80, thickness: 18, color: "#e65c00", zIndex: 1, blur: 1 },
  ];

  const pulseIntensity = Math.sin(pulsePhase * 0.1) * 0.3 + 0.7;

  return (
    <div 
      className={`relative ${sizeClasses[size]} mx-auto`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "50% 50%"
      }}
      data-testid="symmetri-continuum"
    >
      <div 
        className="absolute inset-0"
        style={{
          transform: `rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
          transformStyle: "preserve-3d",
          transition: prefersReducedMotion ? "none" : "transform 0.1s ease-out"
        }}
      >
        <div 
          className="absolute inset-0 rounded-full opacity-15"
          style={{
            background: `radial-gradient(circle, rgba(255,140,0,${0.12 * pulseIntensity}) 0%, transparent 50%)`,
            transform: `translateZ(-50px) scale(1.1)`,
            filter: "blur(12px)"
          }}
        />

        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 400 400"
          style={{ transform: "translateZ(0)" }}
        >
          <defs>
            <radialGradient id="torusCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#ff6600" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e65c00" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="torusStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8c00" stopOpacity={0.9 * pulseIntensity} />
              <stop offset="50%" stopColor="#ff6600" stopOpacity={0.6 * pulseIntensity} />
              <stop offset="100%" stopColor="#e65c00" stopOpacity={0.9 * pulseIntensity} />
            </linearGradient>

            <filter id="torusGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "200px 200px" }}>
            {torusLayers.map((layer, i) => {
              const skewAngle = 60 + i * 5;
              return (
                <g key={i} style={{ filter: layer.blur ? `blur(${layer.blur}px)` : undefined }}>
                  <ellipse
                    cx="200"
                    cy="200"
                    rx={layer.radius}
                    ry={layer.radius * 0.3}
                    fill="none"
                    stroke={layer.color}
                    strokeWidth={layer.thickness}
                    strokeOpacity={0.15 + i * 0.05}
                    style={{ 
                      transform: `rotateX(${skewAngle}deg)`,
                      transformOrigin: "200px 200px"
                    }}
                  />
                  
                  <ellipse
                    cx="200"
                    cy="200"
                    rx={layer.radius}
                    ry={layer.radius * 0.3}
                    fill="none"
                    stroke="url(#torusStroke)"
                    strokeWidth={2}
                    strokeOpacity={0.6 - i * 0.1}
                    style={{ 
                      transform: `rotateX(${skewAngle}deg)`,
                      transformOrigin: "200px 200px"
                    }}
                    filter="url(#torusGlow)"
                  />
                </g>
              );
            })}
          </g>

          {pulseRings.map(ring => (
            <ellipse
              key={ring.id}
              cx="200"
              cy="200"
              rx={60 + ring.progress}
              ry={(60 + ring.progress) * 0.3}
              fill="none"
              stroke="#ff8c00"
              strokeWidth="0.5"
              strokeOpacity={ring.opacity * 0.35}
              style={{ 
                transform: "rotateX(60deg)",
                transformOrigin: "200px 200px"
              }}
            />
          ))}

          {!prefersReducedMotion && particleAngles.map((angle, i) => {
            const particle = particles[i];
            const layerConfig = torusLayers[particle.layer];
            const rad = (angle - 90) * (Math.PI / 180);
            const orbitRadius = layerConfig.radius;
            
            const x = 200 + Math.cos(rad) * orbitRadius;
            const baseY = 200 + Math.sin(rad) * (orbitRadius * 0.3);
            const zOffset = Math.sin(rad) * 10 * (particle.layer + 1);
            const y = baseY + zOffset;
            
            const behindTorus = Math.sin(rad) > 0.3;
            
            return (
              <circle
                key={particle.id}
                cx={x}
                cy={y}
                r={particle.size}
                fill={layerConfig.color}
                opacity={behindTorus ? particle.opacity * 0.3 : particle.opacity * pulseIntensity}
                filter="url(#coreGlow)"
              />
            );
          })}

          <circle
            cx="200"
            cy="200"
            r="25"
            fill="url(#torusCore)"
            filter="url(#coreGlow)"
          />
          
          <circle
            cx="200"
            cy="200"
            r="8"
            fill="#ff8c00"
            opacity={pulseIntensity}
            filter="url(#coreGlow)"
          />
          
          {!prefersReducedMotion && (
            <circle
              cx="200"
              cy="200"
              r={12 + pulsePhase * 0.3}
              fill="none"
              stroke="#ff8c00"
              strokeWidth="1"
              opacity={Math.max(0, 0.5 - pulsePhase * 0.005)}
            />
          )}
        </svg>

        {!prefersReducedMotion && (
          <>
            <div 
              className="absolute w-1.5 h-1.5 rounded-full bg-[#ff8c00]"
              style={{
                left: "15%",
                top: "20%",
                transform: `translate(${Math.sin(rotation * 0.05) * 5}px, ${Math.cos(rotation * 0.05) * 5}px) translateZ(30px)`,
                opacity: 0.4,
                boxShadow: "0 0 4px rgba(255,140,0,0.3)"
              }}
            />
            <div 
              className="absolute w-1 h-1 rounded-full bg-[#ff6600]"
              style={{
                right: "20%",
                top: "25%",
                transform: `translate(${Math.cos(rotation * 0.07) * 4}px, ${Math.sin(rotation * 0.07) * 4}px) translateZ(20px)`,
                opacity: 0.35,
                boxShadow: "0 0 3px rgba(255,102,0,0.25)"
              }}
            />
            <div 
              className="absolute w-0.5 h-0.5 rounded-full bg-[#e65c00]"
              style={{
                left: "25%",
                bottom: "30%",
                transform: `translate(${Math.sin(rotation * 0.04) * 6}px, ${Math.cos(rotation * 0.04) * 6}px) translateZ(15px)`,
                opacity: 0.3,
                boxShadow: "0 0 2px rgba(230,92,0,0.2)"
              }}
            />
          </>
        )}
      </div>

      {showLabels && (
        <>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 text-right hidden lg:block"
            style={{ transform: `translateX(-100%) translateY(-50%) translateZ(${mousePosition.x * -0.2}px)` }}
          >
            <div className="text-[10px] font-mono text-[#ff8c00]/60 tracking-widest mb-1">SENSE</div>
            <div className="text-[9px] text-white/40">Intent signals flowing</div>
          </div>
          
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-4 hidden lg:block"
            style={{ transform: `translateX(100%) translateY(-50%) translateZ(${mousePosition.x * 0.2}px)` }}
          >
            <div className="text-[10px] font-mono text-[#ff6600]/60 tracking-widest mb-1">DEPLOY</div>
            <div className="text-[9px] text-white/40">Actions orchestrated</div>
          </div>
          
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-4 text-center"
            style={{ transform: `translateX(-50%) translateY(100%) translateZ(${mousePosition.y * 0.2}px)` }}
          >
            <div className="text-xs font-mono text-[#ff8c00] tracking-[0.3em] mb-1">
              SYMMETRI CONTINUUM
            </div>
            <div className="text-[10px] text-white/50">
              Signal → Decision → Action → Revenue
            </div>
          </div>
        </>
      )}
    </div>
  );
}
