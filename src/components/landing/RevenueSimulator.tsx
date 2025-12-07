import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Zap, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Loader2, 
  Download,
  Play,
  Rocket,
  Users,
  Building2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SimulationResult {
  dailyConversations: number;
  monthlyMeetings: number;
  monthlyPipelineValue: number;
  pipelineMultiplier: number;
  marketCoverageDays: number;
  traditionalMeetings: number;
}

function SlotNumber({ 
  value, 
  isSpinning, 
  prefix = "", 
  suffix = "",
  className = ""
}: { 
  value: number; 
  isSpinning: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const safeValue = value ?? 0;
  const [displayValue, setDisplayValue] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isSpinning) {
      let iterations = 0;
      const maxIterations = 20;
      const targetValue = safeValue;
      
      intervalRef.current = setInterval(() => {
        iterations++;
        if (iterations < maxIterations) {
          setDisplayValue(Math.floor(Math.random() * Math.max(targetValue, 1) * 1.5));
        } else {
          setDisplayValue(targetValue);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 50);
      
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setDisplayValue(safeValue);
    }
  }, [safeValue, isSpinning]);

  const formattedValue = (displayValue ?? 0).toLocaleString();

  return (
    <span className={`font-mono tabular-nums ${isSpinning ? "animate-pulse" : ""} ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

function SignalVisualization({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1200 600" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="signalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6600" stopOpacity="0" />
            <stop offset="20%" stopColor="#FF6600" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#FF5500" stopOpacity="1" />
            <stop offset="60%" stopColor="#FF4400" stopOpacity="1" />
            <stop offset="80%" stopColor="#FF3300" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF3300" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6600" />
            <stop offset="50%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#FF4400" />
          </linearGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <line 
          x1="0" y1="300" x2="1200" y2="300" 
          stroke="url(#signalGradient)" 
          strokeWidth={isActive ? "3" : "2"}
          filter="url(#glow)"
          className={`transition-all duration-700 ${isActive ? "opacity-100" : "opacity-40"}`}
        />
        
        {isActive && (
          <>
            <circle cx="600" cy="300" r="60" fill="none" stroke="url(#coreGlow)" strokeWidth="1" opacity="0.3" filter="url(#softGlow)">
              <animate attributeName="r" values="60;80;60" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="600" cy="300" r="40" fill="none" stroke="url(#coreGlow)" strokeWidth="1.5" opacity="0.5" filter="url(#softGlow)">
              <animate attributeName="r" values="40;55;40" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="600" cy="300" r="20" fill="none" stroke="url(#coreGlow)" strokeWidth="2" opacity="0.7" filter="url(#glow)">
              <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="600" cy="300" r="8" fill="url(#coreGlow)" opacity="0.9" filter="url(#glow)">
              <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
        
        {!isActive && (
          <circle cx="600" cy="300" r="6" fill="#FF5500" opacity="0.6" filter="url(#glow)" />
        )}

        {[100, 250, 400, 550, 700, 850, 1000, 1100].map((x, i) => (
          <circle 
            key={i}
            cx={x} 
            cy="300" 
            r="2" 
            fill={i < 4 ? "#FF6600" : "#FF4400"} 
            opacity={isActive ? 0.6 : 0.2}
            className="transition-opacity duration-500"
          >
            {isActive && (
              <animate 
                attributeName="opacity" 
                values="0.6;0.2;0.6" 
                dur={`${1.5 + i * 0.2}s`} 
                repeatCount="indefinite" 
              />
            )}
          </circle>
        ))}
      </svg>
    </div>
  );
}

export function RevenueSimulator() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  
  const [tam, setTam] = useState(5000);
  const [avgDealValue, setAvgDealValue] = useState(50000);
  const [teamSize, setTeamSize] = useState(5);
  
  const [hasSimulated, setHasSimulated] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  const [results, setResults] = useState<SimulationResult>({
    dailyConversations: 0,
    monthlyMeetings: 0,
    monthlyPipelineValue: 0,
    pipelineMultiplier: 0,
    marketCoverageDays: 0,
    traditionalMeetings: 0,
  });

  const simulationMutation = useMutation({
    mutationFn: async (params: { tam: number; avgDealValue: number; teamSize: number }) => {
      const response = await apiRequest("POST", "/api/simulate-revenue", params);
      const data = await response.json();
      return data.result as SimulationResult;
    },
    onSuccess: (result) => {
      setTimeout(() => {
        setResults(result);
        setIsSpinning(false);
        setHasSimulated(true);
      }, 1500);
    },
    onError: () => {
      // Real agentic outreach KPIs per rep per day:
      // Email: 20/day × 18% response = 3.6 conversations
      // LinkedIn: 20 requests → 6 connect (30%) + 5.6 non-connector responses (14 × 40%) = 11.6 conversations
      // Total: ~15 conversations/day per rep
      const emailConversations = 20 * 0.18; // 3.6
      const linkedInConnects = 20 * 0.30; // 6
      const linkedInNonConnectResponses = (20 - linkedInConnects) * 0.40; // 5.6
      const dailyConversationsPerRep = emailConversations + linkedInConnects + linkedInNonConnectResponses; // ~15
      
      const totalDailyConversations = Math.round(dailyConversationsPerRep * teamSize);
      
      // ~18% of conversations convert to qualified meetings
      const meetingConversionRate = 0.18;
      const dailyMeetings = totalDailyConversations * meetingConversionRate;
      const monthlyMeetings = Math.round(dailyMeetings * 22); // 22 working days
      
      // Traditional SDR: ~2-3 meetings/week = 10/month per rep
      const traditionalMeetingsPerRep = 10;
      const traditionalMonthlyMeetings = traditionalMeetingsPerRep * teamSize;
      
      // Pipeline multiplier
      const multiplier = monthlyMeetings / traditionalMonthlyMeetings;
      
      // Pipeline value = meetings × deal value × 30% opportunity rate
      const opportunityRate = 0.30;
      const monthlyPipelineValue = Math.round(monthlyMeetings * avgDealValue * opportunityRate);
      
      // Market coverage: days to touch entire TAM
      const dailyTouches = (20 + 20) * teamSize; // emails + LinkedIn per day
      const marketCoverageDays = Math.round(tam / dailyTouches);
      
      setResults({
        dailyConversations: totalDailyConversations,
        monthlyMeetings: monthlyMeetings,
        monthlyPipelineValue: monthlyPipelineValue,
        pipelineMultiplier: Math.round(multiplier * 10) / 10,
        marketCoverageDays: marketCoverageDays,
        traditionalMeetings: traditionalMonthlyMeetings,
      });
      setIsSpinning(false);
      setHasSimulated(true);
    },
  });

  const runSimulation = () => {
    setIsSpinning(true);
    setHasSimulated(false);
    simulationMutation.mutate({ tam, avgDealValue, teamSize });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      await apiRequest("POST", "/api/blueprint-download", { 
        email, 
        simulationData: { tam, avgDealValue, teamSize, results } 
      });
    } catch {
    }
    
    setEmailSubmitted(true);
    setTimeout(() => {
      setShowEmailGate(false);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatTAM = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  return (
    <section 
      ref={ref}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-testid="revenue-simulator-section"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-12 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-6">Pipeline Simulator</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Calculate Your</span>
            <br />
            <span className="bg-gradient-to-r from-[#FF8C00] via-[#ff7a1a] to-[#E65C00] bg-clip-text text-transparent">
              Pipeline Multiplier
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            See how agentic outreach transforms your team's capacity. Real KPIs from live deployments.
          </p>
        </div>
        
        <div className="relative mb-8 h-32 sm:h-40">
          <SignalVisualization isActive={hasSimulated || isSpinning} />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className={`basalt-panel ember-edge-glow rounded-xl animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF5500]" />
                Configure Your Market
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm text-white/70 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#FF6600]" />
                    Total Addressable Market (TAM)
                  </label>
                  <span className="text-lg font-bold bg-gradient-to-r from-[#FF6600] to-[#FF5500] bg-clip-text text-transparent">
                    {formatTAM(tam)} companies
                  </span>
                </div>
                <input
                  type="range"
                  value={tam}
                  onChange={(e) => setTam(Number(e.target.value))}
                  min={500}
                  max={50000}
                  step={500}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  data-testid="slider-tam"
                  style={{
                    background: `linear-gradient(to right, #FF6600 0%, #FF5500 ${((tam - 500) / (50000 - 500)) * 100}%, rgba(255,255,255,0.1) ${((tam - 500) / (50000 - 500)) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <p className="text-xs text-white/40 mt-2">Companies matching your Ideal Customer Profile</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm text-white/70 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#FF5500]" />
                    Average Deal Value
                  </label>
                  <span className="text-lg font-bold bg-gradient-to-r from-[#FF5500] to-[#FF4400] bg-clip-text text-transparent">
                    {formatCurrency(avgDealValue)}
                  </span>
                </div>
                <input
                  type="range"
                  value={avgDealValue}
                  onChange={(e) => setAvgDealValue(Number(e.target.value))}
                  min={5000}
                  max={500000}
                  step={5000}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  data-testid="slider-deal-value"
                  style={{
                    background: `linear-gradient(to right, #FF5500 0%, #FF4400 ${((avgDealValue - 5000) / (500000 - 5000)) * 100}%, rgba(255,255,255,0.1) ${((avgDealValue - 5000) / (500000 - 5000)) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm text-white/70 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FF6600]" />
                    Sales Team Size
                  </label>
                  <span className="text-lg font-bold text-white">{teamSize} reps</span>
                </div>
                <input
                  type="range"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  data-testid="slider-team-size"
                  style={{
                    background: `linear-gradient(to right, #FF6600 0%, #FF4400 ${((teamSize - 1) / (50 - 1)) * 100}%, rgba(255,255,255,0.1) ${((teamSize - 1) / (50 - 1)) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>

              <Button 
                onClick={runSimulation}
                disabled={isSpinning}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#FF8C00] via-[#ff7a1a] to-[#E65C00] hover:from-[#ff7a1a] hover:to-[#E65C00] text-black border-0 rounded-xl transition-all duration-300 shadow-lg shadow-[#FF8C00]/20"
                data-testid="button-run-simulation"
              >
                {isSpinning ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card className={`basalt-panel ember-edge-glow rounded-xl animate-on-scroll ${isVisible ? "visible" : ""} delay-200 ${hasSimulated ? "border-[#FF5500]/30" : ""}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#FF5500]" />
                Simulation Results
                {isSpinning && (
                  <span className="ml-auto text-sm font-normal text-[#FF5500] animate-pulse">
                    Calculating...
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`text-center py-6 rounded-xl ${hasSimulated ? "bg-gradient-to-br from-[#FF8C00]/10 to-[#E65C00]/10 border border-[#FF8C00]/20" : "bg-white/5 border border-white/10"}`}>
                <p className="text-sm text-white/50 mb-2">Monthly Pipeline Value</p>
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#FF8C00] via-[#ff7a1a] to-[#E65C00] bg-clip-text text-transparent">
                  {hasSimulated || isSpinning ? (
                    <SlotNumber 
                      value={results.monthlyPipelineValue} 
                      isSpinning={isSpinning}
                      prefix="$"
                      className="text-4xl sm:text-5xl"
                    />
                  ) : (
                    <span className="text-white/20">$—</span>
                  )}
                </div>
                <p className="text-xs text-white/40 mt-2">Qualified Opportunities Created</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <TrendingUp className="w-5 h-5 text-[#FF8C00] mx-auto mb-2" />
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#FF8C00] to-[#E65C00] bg-clip-text text-transparent">
                    {hasSimulated || isSpinning ? (
                      <>
                        <SlotNumber 
                          value={Math.floor(results.pipelineMultiplier)} 
                          isSpinning={isSpinning}
                        />
                        <span className="text-lg">.{Math.round((results.pipelineMultiplier % 1) * 10)}x</span>
                      </>
                    ) : (
                      <span className="text-white/20">—x</span>
                    )}
                  </div>
                  <p className="text-xs text-white/50">vs Traditional Outreach</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Users className="w-5 h-5 text-[#ff7a1a] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {hasSimulated || isSpinning ? (
                      <SlotNumber 
                        value={results.monthlyMeetings} 
                        isSpinning={isSpinning}
                        suffix="/mo"
                      />
                    ) : (
                      <span className="text-white/20">—/mo</span>
                    )}
                  </div>
                  <p className="text-xs text-white/50">Qualified Meetings</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Zap className="w-5 h-5 text-[#FF8C00] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {hasSimulated || isSpinning ? (
                      <SlotNumber 
                        value={results.dailyConversations} 
                        isSpinning={isSpinning}
                        suffix="/day"
                      />
                    ) : (
                      <span className="text-white/20">—/day</span>
                    )}
                  </div>
                  <p className="text-xs text-white/50">Conversations Started</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Target className="w-5 h-5 text-[#E65C00] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {hasSimulated || isSpinning ? (
                      <SlotNumber 
                        value={results.marketCoverageDays} 
                        isSpinning={isSpinning}
                        suffix=" days"
                      />
                    ) : (
                      <span className="text-white/20">— days</span>
                    )}
                  </div>
                  <p className="text-xs text-white/50">Full TAM Coverage</p>
                </div>
              </div>

              {hasSimulated && (
                <Button 
                  onClick={() => setShowEmailGate(true)}
                  className="w-full h-12 font-semibold bg-transparent border border-[#FF5500]/50 text-white hover:bg-[#FF5500]/10 hover:border-[#FF5500] rounded-xl transition-all duration-300"
                  data-testid="button-download-blueprint"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Your Pipeline Blueprint
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        <p className={`text-center text-white/50 mt-8 max-w-2xl mx-auto text-sm animate-on-scroll ${isVisible ? "visible" : ""} delay-300`}>
          Based on real agentic outreach KPIs: 18% email response rate, 30% LinkedIn connection rate, 40% non-connector response rate.
        </p>
      </div>

      <Dialog open={showEmailGate} onOpenChange={setShowEmailGate}>
        <DialogContent className="bg-[#0a0a0a] border-[#FF8C00]/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-[#FF5500]" />
              Get Your Pipeline Blueprint
            </DialogTitle>
            <DialogDescription className="text-white/60">
              We'll send your personalized pipeline projection and implementation roadmap.
            </DialogDescription>
          </DialogHeader>
          
          {emailSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF8C00] via-[#ff7a1a] to-[#E65C00] flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-black" />
              </div>
              <p className="text-lg font-bold text-white">Blueprint Sent!</p>
              <p className="text-white/50 text-sm mt-2">Check your inbox for your personalized roadmap.</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                data-testid="input-email-gate"
              />
              <Button 
                type="submit"
                className="w-full h-12 font-bold bg-gradient-to-r from-[#FF8C00] via-[#ff7a1a] to-[#E65C00] hover:from-[#ff7a1a] hover:to-[#E65C00] text-black border-0 rounded-xl"
                data-testid="button-submit-email"
              >
                <Download className="w-4 h-4 mr-2" />
                Send My Blueprint
              </Button>
              <p className="text-xs text-center text-white/30">
                No spam. Just your revenue roadmap.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
