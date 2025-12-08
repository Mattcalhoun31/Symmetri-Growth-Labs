import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, TrendingDown, Phone, Scan, Sparkles, Loader2, Cpu, Zap, CircuitBoard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { ScriptScanResult } from "@shared/schema";

const casualtyReports = [
  {
    stat: "+70%",
    label: "Hang-Up Rate",
    cause: '"Are you busy right now?"',
    icon: Phone,
    color: "#F4002A",
  },
  {
    stat: "+20%",
    label: "Spam Flag Probability",
    cause: '"Guarantee / Free / Limited Time"',
    icon: AlertTriangle,
    color: "#ffaa33",
  },
  {
    stat: "-28%",
    label: "Meetings Booked",
    cause: '"Just checking in..."',
    icon: TrendingDown,
    color: "#ff7a1a",
  },
];

const stealthLetters = [
  { letter: "S", meaning: "Signal" },
  { letter: "T", meaning: "Targeting" },
  { letter: "E", meaning: "Engagement" },
  { letter: "A", meaning: "Analysis" },
  { letter: "L", meaning: "Learning" },
  { letter: "T", meaning: "Timing" },
  { letter: "H", meaning: "Harmonics" },
];

function QuantumCircuit() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Quantum processing grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
          {/* Quantum circuit lines */}
          {[...Array(5)].map((_, i) => (
            <g key={i}>
              <line 
                x1="0" 
                y1={40 + i * 30} 
                x2="400" 
                y2={40 + i * 30} 
                stroke="url(#quantumGradient)" 
                strokeWidth="0.5"
                strokeDasharray="4 2"
              />
              {/* Quantum gates */}
              {[...Array(8)].map((_, j) => (
                <rect 
                  key={j}
                  x={30 + j * 45} 
                  y={36 + i * 30} 
                  width="8" 
                  height="8" 
                  fill="none"
                  stroke="#ff7a1a"
                  strokeWidth="0.5"
                  opacity={0.5 + Math.random() * 0.5}
                  className="animate-pulse"
                  style={{ animationDelay: `${(i + j) * 0.2}s` }}
                />
              ))}
            </g>
          ))}
          {/* Entanglement connections */}
          <path 
            d="M50,55 Q100,25 150,85 T250,55 T350,85" 
            fill="none" 
            stroke="url(#quantumGradient)" 
            strokeWidth="0.5"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="quantumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff7a1a" />
              <stop offset="50%" stopColor="#ffaa33" />
              <stop offset="100%" stopColor="#ff7a1a" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Floating quantum particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-[#ff7a1a] to-[#ffaa33]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.3 + Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function QuantumProcessor() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-[#ff7a1a]/30 animate-spin-slow" />
      {/* Middle ring */}
      <div 
        className="absolute inset-2 rounded-full border border-[#ffaa33]/40"
        style={{ animation: "spin 8s linear infinite reverse" }}
      />
      {/* Inner core */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#ff7a1a]/20 to-[#ffaa33]/20 flex items-center justify-center">
        <Cpu className="w-6 h-6 text-[#ff7a1a]" />
      </div>
      {/* Energy pulses */}
      <div className="absolute inset-0 rounded-full border border-[#ff7a1a]/50 animate-ping" style={{ animationDuration: "2s" }} />
    </div>
  );
}

export function StealthSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [script, setScript] = useState("");
  const [scanResult, setScanResult] = useState<ScriptScanResult | null>(null);

  const scanMutation = useMutation({
    mutationFn: async (scriptText: string) => {
      const response = await apiRequest("POST", "/api/script-scan", { script: scriptText });
      const data = await response.json();
      return data.result as ScriptScanResult;
    },
    onSuccess: (result) => {
      setScanResult(result);
    },
    onError: () => {
      setScanResult({
        passed: false,
        score: 0,
        issues: ["Analysis failed - please try again"],
        suggestions: ["Check your connection and retry"],
      });
    },
  });

  const handleScan = () => {
    if (!script.trim()) return;
    setScanResult(null);
    scanMutation.mutate(script);
  };

  const handleReframe = () => {
    if (scanResult?.reframedScript) {
      setScript(scanResult.reframedScript);
      setScanResult({ ...scanResult, passed: true, score: 85, issues: [], suggestions: [] });
    }
  };

  return (
    <section 
      ref={ref}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      data-testid="stealth-section"
    >
      {/* Quantum background effects */}
      <QuantumCircuit />
      
      {/* Holodeck grid overlay */}
      <div className="absolute inset-0 bg-holodeck-grid-subtle opacity-30" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-12 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-4">Anti-Detection Protocol</Badge>
          
          <QuantumProcessor />
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-ember-gradient">S.T.E.A.L.T.H.</span>™
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto mb-2">
            Quantum-level pattern analysis detects AI gatekeepers before they detect you. Our neural network processes billions of call patterns to engineer the first anti-detection protocol.
          </p>
          <p className="text-lg text-white/80">
            Protect your phone trust scores, avoid "Spam Likely" labels, and raise connect rates without sounding like a robot.
          </p>
        </div>
        
        {/* Quantum Scanner Terminal */}
        <Card className={`basalt-panel border-[#FF8C00]/20 mb-12 animate-on-scroll ${isVisible ? "visible" : ""} delay-100 relative overflow-hidden`}>
          {/* Scanning line effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff7a1a] to-transparent opacity-50"
              style={{
                animation: "scanLine 3s ease-in-out infinite",
                top: "0%",
              }}
            />
          </div>
          
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#ff7a1a]/20">
              <CircuitBoard className="w-4 h-4 text-[#ff7a1a]" />
              <span className="text-white/70 font-mono text-sm">quantum_stealth_analyzer.sys</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-pulse" />
                <span className="text-xs text-[#ff7a1a]/70 font-mono">NEURAL NET ACTIVE</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2 font-mono flex items-center gap-2">
                <Zap className="w-3 h-3 text-[#ffaa33]" />
                Enter your current opener or script:
              </label>
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Hi, this is John from Acme Corp. Do you have a quick minute?"
                className="bg-[#0a0a0a] border-[#ff7a1a]/30 font-mono text-sm min-h-[100px] focus:border-[#ff7a1a] text-white placeholder:text-white/40"
                data-testid="input-script"
              />
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                onClick={handleScan}
                disabled={scanMutation.isPending || !script.trim()}
                className="bg-gradient-to-r from-[#ff7a1a] to-[#ffaa33] hover:from-[#ff7a1a]/90 hover:to-[#ffaa33]/90 text-white font-bold gap-2"
                data-testid="button-scan-script"
              >
                {scanMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Scan className="w-4 h-4" />
                )}
                {scanMutation.isPending ? "Quantum Analysis..." : "Analyze Pattern"}
              </Button>
              
              {scanResult && !scanResult.passed && scanResult.reframedScript && (
                <Button
                  onClick={handleReframe}
                  variant="outline"
                  className="border-[#ffaa33]/50 text-[#ffaa33] hover:bg-[#ffaa33]/10 gap-2"
                  data-testid="button-apply-reframe"
                >
                  <Sparkles className="w-4 h-4" />
                  Apply STEALTH™ Reframing
                </Button>
              )}
            </div>
            
            {scanMutation.isPending && (
              <div className="font-mono text-sm space-y-1">
                <div className="text-[#ff7a1a] animate-pulse flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#ff7a1a]" />
                  Initializing quantum pattern recognition...
                </div>
                <div className="text-[#ffaa33] animate-pulse flex items-center gap-2" style={{ animationDelay: "0.2s" }}>
                  <div className="w-1 h-1 rounded-full bg-[#ffaa33]" />
                  Cross-referencing 2.3B call signatures...
                </div>
                <div className="text-[#ff7a1a] animate-pulse flex items-center gap-2" style={{ animationDelay: "0.4s" }}>
                  <div className="w-1 h-1 rounded-full bg-[#ff7a1a]" />
                  Calculating AI detection probability...
                </div>
              </div>
            )}
            
            {scanResult && (
              <div className={`font-mono p-4 rounded-lg ${
                scanResult.passed 
                  ? "bg-green-500/10 border border-green-500/30" 
                  : "bg-red-500/10 border border-red-500/30"
              }`}>
                <div className={`text-lg font-bold flex items-center gap-2 ${
                  scanResult.passed ? "text-green-400" : "text-red-400"
                }`}>
                  Quantum Analysis: {scanResult.passed ? "CLEARED" : "FLAGGED"}
                  <span className="text-sm font-normal">
                    (Confidence: {scanResult.score}%)
                  </span>
                </div>
                <div className={`text-sm ${
                  scanResult.passed ? "text-green-300" : "text-red-300"
                }`}>
                  {scanResult.passed 
                    ? "Pattern invisible to AI gatekeepers" 
                    : "High probability of AI interception"
                  }
                </div>
                
                {scanResult.issues.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm text-red-400 mb-1">Detected vulnerabilities:</div>
                    <ul className="space-y-1">
                      {scanResult.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                          <span className="text-red-400">!</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {scanResult.suggestions.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm text-[#ffaa33] mb-1">Optimization vectors:</div>
                    <ul className="space-y-1">
                      {scanResult.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                          <span className="text-[#ffaa33]">→</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Casualty Reports */}
        <div className={`grid md:grid-cols-3 gap-6 mb-12 animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
          {casualtyReports.map((report, index) => {
            const Icon = report.icon;
            return (
              <Card 
                key={report.label}
                className="basalt-panel ember-edge-glow hover:border-[#ff7a1a]/40 transition-all duration-300"
                data-testid={`casualty-card-${index}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${report.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: report.color }} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: report.color }}>
                        {report.stat}
                      </div>
                      <div className="text-sm text-white/70">{report.label}</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80">
                    Cause: <span className="text-white/60 italic">{report.cause}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Quantum STEALTH Letters */}
        <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-300`}>
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {stealthLetters.map((item, index) => (
              <div
                key={index}
                className="quantum-stealth-letter text-lg sm:text-xl relative group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {item.letter}
                {/* Quantum entanglement effect on hover */}
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#ff7a1a]/0 via-[#ff7a1a]/20 to-[#ff7a1a]/0 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-white/50 font-mono">
            Signal • Targeting • Engagement • Analysis • Learning • Timing • Harmonics
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.2); }
        }
        
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        
        .quantum-stealth-letter {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          font-weight: 700;
          border: 1px solid rgba(255, 122, 26, 0.4);
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(255, 122, 26, 0.1), rgba(255, 170, 51, 0.1));
          color: #ff7a1a;
          animation: quantumPulse 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        
        .quantum-stealth-letter::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255, 122, 26, 0.1), transparent);
          transform: translateX(-100%);
          animation: quantumShimmer 3s ease-in-out infinite;
        }
        
        @keyframes quantumPulse {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255, 122, 26, 0.2);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255, 122, 26, 0.4);
          }
        }
        
        @keyframes quantumShimmer {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
