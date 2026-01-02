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
                  border: "2.5px solid #FF8C00"
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
        <div className="p-6 rounded-xl bg-[#0a0a0a] border border-[#FF8C00]/30 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#FF8C00]" />
              <span className="text-sm font-bold text-[#FF8C00]">STEALTH RECON INTELLIGENCE</span>
            </div>
            <Badge variant="outline" className="border-[#FF8C00]/50 text-[#FF8C00] text-[10px]">
              AI-POWERED
            </Badge>
          </div>
          
          <p className="text-sm text-white/80 leading-relaxed mb-4">{result.research.companyOverview}</p>
          
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-[#FFE5B4] font-bold tracking-wider uppercase">KEY TRIGGERS</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {result.research.keyTriggers.slice(0, 2).map((trigger, i) => (
                  <Badge key={i} className="bg-gradient-to-r from-[#FF8C00] to-[#E65C00] text-white text-xs font-bold px-3 py-1.5 border-0">
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
          <div className="p-5 rounded-xl bg-[#0a0a0a]">
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
          
          <div className="p-5 rounded-xl bg-[#0a0a0a]">
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
              <p className="text-[11px] text-white/70 leading-relaxed">{result.stealthScr
