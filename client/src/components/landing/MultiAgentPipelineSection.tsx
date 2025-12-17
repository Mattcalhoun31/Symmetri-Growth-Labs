import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Target, FileSearch, Wand2, Rocket, Zap, Loader2, ArrowRight, Download, Mail, Linkedin, Phone, Brain, CheckCircle, Copy, Check
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PipelineDemoResult } from "@shared/schema";

type DemoState = "idle" | "generating" | "complete";

const pipelineSteps = [
  { id: 1, icon: Target, label: "Capture", color: "#FF8C00" },
  { id: 2, icon: FileSearch, label: "Research", color: "#FF8C00" },
  { id: 3, icon: Wand2, label: "Orchestrate", color: "#FF8C00" },
  { id: 4, icon: Rocket, label: "Launch", color: "#FF8C00" },
];

function AgentSwarmVisualization({ activeStep, isAnimating }: { activeStep: number; isAnimating: boolean }) {
  return (
    <div className="relative h-64 sm:h-80">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
        <ellipse cx="300" cy="150" rx="250" ry="100" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <ellipse cx="300" cy="150" rx="200" ry="80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <ellipse cx="300" cy="150" rx="150" ry="60" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        
        {isAnimating && (
          <circle r="4" fill="rgba(200,120,50,0.8)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M 50 150 C 150 50, 450 50, 550 150 C 450 250, 150 250, 50 150"
            />
          </circle>
        )}
        
        {pipelineSteps.map((step, i) => {
          const angle = (i * 90 - 45) * (Math.PI / 180);
          const x = 300 + Math.cos(angle) * 180;
          const y = 150 + Math.sin(angle) * 70;
          
          return (
            <g key={step.id}>
              <line 
                x1="300" y1="150" x2={x} y2={y} 
                stroke="rgba(200,120,50,0.7)"
                strokeWidth="1"
                strokeDasharray="5 4"
              />
              <circle 
                cx={x} cy={y} r="24"
                fill="rgba(5,5,5,0.98)"
                stroke="rgba(200,120,50,0.7)"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
        
        <circle 
          cx="300" cy="150" r="40"
          fill="rgba(10,10,10,0.95)"
          stroke="rgba(200,120,50,0.8)"
          strokeWidth="2"
        />
        <circle 
          cx="300" cy="150" r="30"
          fill="rgba(200,120,50,0.08)"
        />
      </svg>
      
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border-2 border-[rgba(200,120,50,0.8)] flex items-center justify-center">
          <Zap className="w-8 h-8 text-[rgba(200,120,50,0.9)]" />
        </div>
      </div>
      
      {pipelineSteps.map((step, i) => {
        const angle = (i * 90 - 45) * (Math.PI / 180);
        const x = 50 + (Math.cos(angle) * 30 + 30);
        const y = 50 + (Math.sin(angle) * 23 + 23);
        const Icon = step.icon;
        
        return (
          <div 
            key={step.id}
            className="absolute"
            style={{ 
              left: `${x}%`, 
              top: `${y}%`, 
              transform: "translate(-50%, -50%)"
            }}
          >
            <Icon 
              className="w-5 h-5"
              style={{ color: "rgba(200,120,50,0.9)" }}
            />
          </div>
        );
      })}
    </div>
  );
}

function PipelineProgress({ activeStep, demoState }: { activeStep: number; demoState: DemoState }) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8">
      {pipelineSteps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i + 1 <= activeStep;
        const isCurrent = i + 1 === activeStep && demoState === "generating";
        
        return (
          <div key={step.id} className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 transition-all duration-500">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCurrent ? "animate-pulse" : ""
                }`}
                style={{ 
                  background: "rgba(5,5,5,0.98)",
                  border: `2.5px solid #FF8C00`
                }}
              >
                {isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#FF8C00]" />
                ) : (
                  <Icon className="w-5 h-5 text-[#FF8C00]" />
                )}
              </div>
              <span className="text-sm font-medium text-white/90 hidden sm:block">
                {step.label}
              </span>
            </div>
            {i < pipelineSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-white/40" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 w-6 p-0 text-white/40 hover:text-[#FF8C00] hover:bg-transparent"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </Button>
  );
}

function ResultsDisplay({ result, onDownload }: { result: PipelineDemoResult; onDownload: () => void }) {
  return (
    <div className="mt-8 space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#0a0a0a] border border-[#FF8C00]/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#FF8C00]" />
              <span className="text-sm font-bold text-[#FF8C00]">GEMINI RESEARCH INTELLIGENCE</span>
            </div>
            <Badge variant="outline" className="border-[#FF8C00]/50 text-[#FF8C00] text-[10px]">
              AI-POWERED
            </Badge>
          </div>
          
          <p className="text-sm text-white/80 leading-relaxed mb-4">{result.research.companyOverview}</p>
          
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-[#FF8C00] font-bold tracking-wider">BUYING SIGNALS</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.research.keyTriggers.slice(0, 3).map((trigger, i) => (
                  <Badge key={i} className="bg-[#FF8C00]/10 border border-[#FF8C00]/30 text-[#FF8C00] text-[10px]">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-[10px] text-[#FF8C00] font-bold tracking-wider">PAIN POINTS</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.research.painPoints.slice(0, 3).map((pain, i) => (
                  <Badge key={i} className="bg-white/5 border border-white/20 text-white/70 text-[10px]">
                    {pain}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-[10px] text-[#FF8C00] font-bold tracking-wider">COMPETITIVE INSIGHTS</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.research.competitiveInsights?.slice(0, 2).map((insight, i) => (
                  <Badge key={i} className="bg-white/5 border border-white/20 text-white/60 text-[10px]">
                    {insight}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#FF8C00]/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF8C00]" />
                <span className="text-xs font-bold text-[#FF8C00]">STEALTH™ EMAIL</span>
              </div>
              <CopyButton text={`Subject: ${result.email.subject}\n\n${result.email.body}`} />
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-white/40 uppercase tracking-wider shrink-0">Subject:</span>
                <span className="text-sm text-[#FF8C00] font-medium">{result.email.subject}</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line line-clamp-4">{result.email.body}</p>
            </div>
          </div>
          
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#FF8C00]/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#FF8C00]" />
                <span className="text-xs font-bold text-[#FF8C00]">LINKEDIN MESSAGE</span>
              </div>
              <CopyButton text={result.linkedinMessage} />
            </div>
            <p className="text-xs text-white/70 leading-relaxed">{result.linkedinMessage}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 rounded-xl bg-[#0a0a0a] border border-[#FF8C00]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF8C00]/20 border border-[#FF8C00] flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#FF8C00]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#FF8C00]">STEALTH™ COLD CALL SCRIPT</span>
              <p className="text-[10px] text-white/40">AI-Resistant | Human-First | Spam-Proof</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#FF8C00] text-black text-[10px] font-bold">
              STEALTH™ CERTIFIED
            </Badge>
            <CopyButton text={result.stealthScript?.fullScript || ''} />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#FF8C00] font-bold block mb-1">OPENER</span>
              <p className="text-[11px] text-white/70 leading-relaxed">{result.stealthScript?.opener}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#FF8C00] font-bold block mb-1">BRIDGE</span>
              <p className="text-[11px] text-white/70 leading-relaxed">{result.stealthScript?.bridge}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#FF8C00] font-bold block mb-1">VALUE HOOK</span>
              <p className="text-[11px] text-white/70 leading-relaxed">{result.stealthScript?.valueHook}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#FF8C00] font-bold block mb-1">CLOSE</span>
              <p className="text-[11px] text-white/70 leading-relaxed">{result.stealthScript?.closeQuestion}</p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-[#FF8C00]/5 border border-[#FF8C00]/20">
            <span className="text-[10px] text-[#FF8C00] font-bold block mb-2">FULL SCRIPT</span>
            <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line">{result.stealthScript?.fullScript}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-[#FF8C00]/10 to-[#FF8C00]/5 border border-[#FF8C00]/30">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-[#FF8C00]" />
          <div>
            <p className="text-sm font-bold text-white">
              <span className="text-[#FF8C00]">Generated in 3 seconds.</span> Your SDRs spend 45+ minutes per prospect.
            </p>
            <p className="text-xs text-white/50">All outputs are STEALTH™ certified and ready to use immediately.</p>
          </div>
        </div>
        <Button 
          onClick={onDownload}
          className="bg-[#FF8C00] hover:bg-[#E65C00] text-black font-bold px-6 gap-2"
          data-testid="button-download-pack"
        >
          <Download className="w-4 h-4" />
          Download Full Pack
        </Button>
      </div>
    </div>
  );
}

export function MultiAgentPipelineSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const { toast } = useToast();
  
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<PipelineDemoResult | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    yourCompany: "",
    yourProduct: "",
    targetPersona: "",
    prospectCompany: "",
  });

  const pipelineMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("https://mattcalhoun31--b5ff9192daae11f09c9442dde27851f2.web.val.run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.result);
        setDemoState("complete");
        setActiveStep(4);
      }
    },
    onError: () => {
      setDemoState("idle");
      setActiveStep(0);
      toast({
        title: "Error",
        description: "Failed to generate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.yourCompany || !formData.prospectCompany) return;
    
    setDemoState("generating");
    setActiveStep(1);
    
    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setActiveStep(i + 1);
    }
    
    pipelineMutation.mutate(formData);
  };

const handleDownload = () => {
    if (!result) return;
    
    const packContent = `SYMMETRI GROWTH LABS - PIPELINE ACTIVATION PACK
==============================================
STEALTH™ Certified Outreach Assets

Generated for: ${formData.yourCompany}
Target: ${formData.targetPersona} at ${formData.prospectCompany}
Product: ${formData.yourProduct}

-------------------------------------------
GEMINI RESEARCH INTELLIGENCE
-------------------------------------------
${result.research.companyOverview}

Buying Signals:
${result.research.keyTriggers.map(t => `• ${t}`).join('\n')}

Pain Points:
${result.research.painPoints.map(p => `• ${p}`).join('\n')}

Competitive Insights:
${result.research.competitiveInsights?.map(c => `• ${c}`).join('\n') || 'N/A'}

-------------------------------------------
STEALTH™ EMAIL
-------------------------------------------
Subject: ${result.email.subject}

${result.email.body}

-------------------------------------------
LINKEDIN MESSAGE
-------------------------------------------
${result.linkedinMessage}

-------------------------------------------
STEALTH™ COLD CALL SCRIPT
-------------------------------------------
${result.stealthScript?.fullScript || ''}

-------------------------------------------
STEALTH™ METHODOLOGY
-------------------------------------------
S - Strategic Call Pattern Management
T - Tonality Optimization for AI Scoring
E - Eliminate Spam Trigger Language
A - Authentic Conversation Techniques
L - Language Reframing Mastery
T - Timing and Volume Control
H - Human-Like Delivery Training

-------------------------------------------
Powered by Symmetri Growth Labs
https://symmetrigrowth.com
`;
    
    const blob = new Blob([packContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Symmetri_Pipeline_Pack_${formData.prospectCompany.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
      
      setTimeout(() => {
        setShowEmailGate(false);
        setEmailSubmitted(false);
      }, 3000);
      
  const isValid = formData.yourCompany && formData.prospectCompany;

  return (
    <section 
      ref={ref}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050505]"
      data-testid="multi-agent-pipeline-section"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <div className={`text-center mb-10 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-6">Multi-Agent AI</Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Your </span>
            <span className="text-ember-gradient">Revenue Swarm</span>
          </h2>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Four specialized agents working in sequence. Try it with your own company.
          </p>
        </div>
        
        <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}>
          <AgentSwarmVisualization activeStep={activeStep} isAnimating={demoState === "generating"} />
        </div>
        
        <div className={`mb-8 animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
          <PipelineProgress activeStep={activeStep} demoState={demoState} />
        </div>
        
        <form onSubmit={handleSubmit} className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-300`}>
          <div className="p-6 rounded-2xl border border-white/20 bg-[#0a0a0a]">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-xs mb-1.5 block text-white font-medium">Your Company</label>
                <Input
                  placeholder="e.g., Symmetri"
                  value={formData.yourCompany}
                  onChange={(e) => setFormData(prev => ({ ...prev, yourCompany: e.target.value }))}
                  className="bg-[#050505] border-white/20 text-white placeholder:text-white/30 focus:border-[#FF8C00]"
                  data-testid="input-your-company"
                />
              </div>
              <div>
                <label className="text-xs mb-1.5 block text-white font-medium">What You Sell</label>
                <Input
                  placeholder="e.g., AI sales platform"
                  value={formData.yourProduct}
                  onChange={(e) => setFormData(prev => ({ ...prev, yourProduct: e.target.value }))}
                  className="bg-[#050505] border-white/20 text-white placeholder:text-white/30 focus:border-[#FF8C00]"
                  data-testid="input-your-product"
                />
              </div>
              <div>
                <label className="text-xs mb-1.5 block text-white font-medium">Target Persona</label>
                <Input
                  placeholder="e.g., VP of Sales"
                  value={formData.targetPersona}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetPersona: e.target.value }))}
                  className="bg-[#050505] border-white/20 text-white placeholder:text-white/30 focus:border-[#FF8C00]"
                  data-testid="input-target-persona"
                />
              </div>
              <div>
                <label className="text-xs mb-1.5 block text-white font-medium">Prospect Company</label>
                <Input
                  placeholder="e.g., Salesforce"
                  value={formData.prospectCompany}
                  onChange={(e) => setFormData(prev => ({ ...prev, prospectCompany: e.target.value }))}
                  className="bg-[#050505] border-white/20 text-white placeholder:text-white/30 focus:border-[#FF8C00]"
                  data-testid="input-prospect-company"
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={!isValid || demoState === "generating"}
                className="bg-gradient-to-r from-[#FF8C00] to-[#E65C00] hover:from-[#FF9500] hover:to-[#FF8C00] text-white font-bold px-10 py-3 gap-2 text-base"
                data-testid="button-run-pipeline"
              >
                {demoState === "generating" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running Agents...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Run Pipeline
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
        {result && demoState === "complete" && (
          <div className={`animate-on-scroll ${isVisible ? "visible" : ""}`}>
            <ResultsDisplay result={result} onDownload={handleDownload} />
          </div>
        )}
      </div>

      <Dialog open={showEmailGate} onOpenChange={setShowEmailGate}>
        <DialogContent className="bg-[#0a0a0a] border-[#FF8C00]/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-[#FF8C00]" />
              Download Pipeline Activation Pack
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Get your STEALTH™ certified outreach assets as a downloadable file.
            </DialogDescription>
          </DialogHeader>
          
          {emailSubmitted ? (
            <div className="flex flex-col items-center py-8 gap-4" data-testid="download-success">
              <div className="w-16 h-16 rounded-full bg-[#FF8C00]/20 flex items-center justify-center animate-pulse">
                <CheckCircle className="w-8 h-8 text-[#FF8C00]" />
              </div>
              <p className="text-white font-bold text-lg">Success!</p>
              <p className="text-white/60 text-sm">Your Pipeline Activation Pack is downloading...</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-sm text-white/70 block mb-2">Work Email</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#050505] border-white/20 text-white placeholder:text-white/30 focus:border-[#FF8C00]"
                  data-testid="input-download-email"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF8C00] to-[#E65C00] hover:from-[#E65C00] hover:to-[#FF8C00] text-black font-bold"
                data-testid="button-submit-download"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Pack
              </Button>
              <p className="text-xs text-white/40 text-center">
                We'll also send you our GTM optimization guide.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
