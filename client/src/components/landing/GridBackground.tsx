import { useEffect, useState } from "react";

interface SignalOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: "orange" | "cyan" | "yellow";
  delay: number;
}

export function GridBackground() {
  const [orbs, setOrbs] = useState<SignalOrb[]>([]);

  useEffect(() => {
    const generateOrbs = () => {
      const newOrbs: SignalOrb[] = [];
      const colors: ("orange" | "cyan" | "yellow")[] = ["orange", "cyan", "yellow"];
      
      for (let i = 0; i < 8; i++) {
        newOrbs.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 40,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 5,
        });
      }
      setOrbs(newOrbs);
    };

    generateOrbs();
  }, []);

  return (
    <div className="grid-background" aria-hidden="true">
      <div className="grid-floor" />
      
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`signal-orb ${orb.color}`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
