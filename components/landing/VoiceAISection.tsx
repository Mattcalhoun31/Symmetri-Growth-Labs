import { useState, useRef, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Loader2,
  Send,
  Keyboard,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const acronymBreakdown = [
  { letter: "S", meaning: "Strategic Call Pattern Management" },
  { letter: "T", meaning: "Tonality Optimization for AI Scoring" },
  { letter: "E", meaning: "Eliminate Spam Trigger Language" },
  { letter: "A", meaning: "Authentic Conversation Techniques" },
  { letter: "L", meaning: "Language Reframing Mastery" },
  { letter: "T", meaning: "Timing and Volume Control" },
  { letter: "H", meaning: "Human-Like Delivery Training" },
];

const resultsStats = [
  { value: "70%", label: "Reduction in hang-ups" },
  { value: "50%", label: "More positive responses" },
  { value: "28%", label: "More meetings booked" },
  { value: "17%", label: "Reduction in spam flags" },
];

const implementationSteps = [
  { phase: "TELL", desc: "12-hour intensive framework training" },
  { phase: "SHOW", desc: "Live call demos with real prospects" },
  { phase: "SHADOW", desc: "Observe & coach in real-time" },
  { phase: "CO-EXECUTE", desc: "1-hour daily joint outreach" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function WaveformVisualization({ isActive }: { isActive: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(40).fill(8));
  
  useEffect(() => {
    if (!isActive) {
      setBars(Array(40).fill(8));
      return;
    }
    
    const interval = setInterval(() => {
      setBars(Array(40).fill(0).map((_, i) => {
        const centerWeight = 1 - Math.abs(i - 20) / 20;
        return 8 + Math.random() * 50 * centerWeight;
      }));
    }, 80);
    
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center gap-[2px] h-20 px-4">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-100 ease-out"
          style={{
            height: `${height}px`,
            background: isActive 
              ? `linear-gradient(to top, #ff7a1a, #ffaa33)` 
              : "rgba(255,255,255,0.15)",
            opacity: isActive ? 0.8 + (height / 100) * 0.2 : 0.3
          }}
        />
      ))}
    </div>
  );
}

function AudioCore({ isActive, isConnected }: { isActive: boolean; isConnected: boolean }) {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full border border-[#ff7a1a]/20 animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-4 rounded-full border border-[#ff7a1a]/30 animate-ping" style={{ animationDuration: "2.5s" }} />
          <div className="absolute inset-8 rounded-full border border-[#ff7a1a]/40 animate-ping" style={{ animationDuration: "2s" }} />
        </>
      )}
      
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff7a1a]/10 to-transparent" />
      
      <div className={`absolute inset-12 rounded-full flex items-center justify-center transition-all duration-500 ${
        isActive 
          ? "bg-gradient-to-br from-[#ff7a1a] to-[#ffaa33] shadow-[0_0_60px_rgba(255,122,26,0.5)]"
          : isConnected
            ? "bg-[#0f0f0f] border border-[#ff7a1a]/30"
            : "bg-[#0f0f0f] border border-white/10"
      }`}>
        {isActive ? (
          <Mic className="w-10 h-10 text-black animate-pulse" />
        ) : (
          <Mic className={`w-10 h-10 ${isConnected ? "text-[#ff7a1a]" : "text-white/30"}`} />
        )}
      </div>
    </div>
  );
}

function AcronymBreakdown({ isVisible }: { isVisible: boolean }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  
  useEffect(() => {
    if (!isVisible) {
      setActiveIndex(-1);
      return;
    }
    
    const sequence = acronymBreakdown.map((_, i) => i);
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < sequence.length) {
        setActiveIndex(sequence[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {acronymBreakdown.map((item, index) => (
          <div
            key={index}
            className={`relative transition-all duration-500 ease-out ${
              activeIndex >= index 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-50 blur-sm"
            }`}
            style={{ 
              transitionDelay: `${index * 80}ms`,
            }}
          >
            <span 
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold transition-all duration-300 ${
                activeIndex >= index 
                  ? "text-[#FF8C00] drop-shadow-[0_0_20px_rgba(255,140,0,0.5)]" 
                  : "text-white/10"
              }`}
              style={{
                textShadow: activeIndex >= index ? "0 0 30px rgba(255,140,0,0.4)" : "none"
              }}
            >
              {item.letter}
            </span>
            {index < acronymBreakdown.length - 1 && (
              <span className="text-2xl sm:text-3xl lg:text-4xl text-white/20 mx-0.5">.</span>
            )}
          </div>
        ))}
        <span 
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FF8C00] ml-1 transition-all duration-500 ${
            activeIndex >= acronymBreakdown.length - 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          ™
        </span>
      </div>
      
      <div className="grid gap-2 max-w-2xl w-full mt-4">
        {acronymBreakdown.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 transition-all duration-400 ${
              activeIndex >= index 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: `${(index * 80) + 200}ms` }}
          >
            <span className="text-[#FF8C00] font-bold text-lg w-6">{item.letter}</span>
            <span className="text-white/30 text-sm">—</span>
            <span className="text-white/70 text-sm">{item.meaning}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsGrid({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
      {resultsStats.map((stat, index) => (
        <div
          key={index}
          className={`text-center transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-3xl sm:text-4xl font-bold text-[#FF8C00] mb-1">{stat.value}</div>
          <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function ImplementationModel({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6">
        {implementationSteps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 sm:gap-4">
            <span className="text-lg sm:text-xl font-bold text-white">{step.phase}</span>
            {index < implementationSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-[#ff7a1a]" />
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {implementationSteps.map((step, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-lg bg-white/[0.02] border border-white/5"
          >
            <div className="text-xs sm:text-sm text-white/60">{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VoiceAISection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [useTextMode, setUseTextMode] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/voice-chat", { 
        message,
        conversationHistory: messages.slice(-10).map(m => ({
          role: m.role,
          content: m.content
        }))
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }]);
      
      if (data.audioUrl && !isMuted) {
        playAudioResponse(data.audioUrl);
      }
      setIsProcessing(false);
    },
    onError: () => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connection issue. Please try again.",
        timestamp: new Date()
      }]);
      setIsProcessing(false);
    }
  });

  const playAudioResponse = async (audioUrl: string) => {
    try {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      console.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const { transcript } = await response.json();
        setMessages(prev => [...prev, {
          role: "user",
          content: transcript,
          timestamp: new Date()
        }]);
        chatMutation.mutate(transcript);
      } else {
        const simulatedTranscript = "Testing my cold call opener.";
        setMessages(prev => [...prev, {
          role: "user",
          content: simulatedTranscript,
          timestamp: new Date()
        }]);
        chatMutation.mutate(simulatedTranscript);
      }
    } catch {
      setIsProcessing(false);
    }
  };

  const handleConnect = () => {
    setIsConnected(true);
    setMessages([{
      role: "assistant",
      content: "Hello! I'm your Symmetri voice coach. Practice your sales pitch with me - I'll respond like a real prospect and give feedback. Ready when you are!",
      timestamp: new Date()
    }]);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsRecording(false);
    setIsPlaying(false);
    setMessages([]);
    setTextInput("");
  };

  const handleTextSubmit = () => {
    if (!textInput.trim() || isProcessing) return;
    
    const userMessage = textInput.trim();
    setTextInput("");
    setIsProcessing(true);
    
    setMessages(prev => [...prev, {
      role: "user",
      content: userMessage,
      timestamp: new Date()
    }]);
    
    chatMutation.mutate(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  return (
    <section 
      ref={ref}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050505]"
      data-testid="voice-ai-section"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(255,122,26,0.15) 0%, transparent 60%)",
          }}
        />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className={`text-center mb-16 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <Badge variant="symmetri" className="mx-auto w-fit mb-6">Proprietary Methodology</Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-ember-gradient">S.T.E.A.L.T.H.™</span>
          </h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-6">
            The AI-Resistant Calling System
          </h3>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
            The methodology that transforms average reps into top performers. 
            Not another AI tool—a complete human performance system with 1-hour daily co-execution.
          </p>
        </div>

        <div 
          className={`rounded-2xl p-8 sm:p-12 mb-16 animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}
          style={{
            background: "linear-gradient(135deg, rgba(255,140,0,0.12) 0%, rgba(255,102,0,0.06) 50%, rgba(5,5,5,0.95) 100%)",
            border: "1px solid rgba(255,140,0,0.25)",
            boxShadow: "0 0 80px rgba(255,140,0,0.1)"
          }}
        >
          <h4 className="text-lg font-semibold text-white text-center mb-8">The Methodology</h4>
          <AcronymBreakdown isVisible={isVisible} />
        </div>

        <div className={`mb-16 animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
          <h4 className="text-lg font-semibold text-white text-center mb-8">Proven Results</h4>
          <ResultsGrid isVisible={isVisible} />
        </div>

        <div className={`mb-16 animate-on-scroll ${isVisible ? "visible" : ""} delay-300`}>
          <h4 className="text-lg font-semibold text-white text-center mb-8">Implementation Model</h4>
          <ImplementationModel isVisible={isVisible} />
        </div>

        <div className={`animate-on-scroll ${isVisible ? "visible" : ""} delay-400`}>
          {!isConnected ? (
            <div className="text-center">
              <div className="mb-8">
                <AudioCore isActive={false} isConnected={false} />
              </div>
              
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-[#ff7a1a] to-[#ffaa33] hover:from-[#ff8c3a] hover:to-[#ffbb44] text-black font-bold px-10 py-6 text-lg"
                data-testid="button-start-session"
              >
                <Phone className="w-5 h-5 mr-2" />
                Experience the S.T.E.A.L.T.H.™ Difference
              </Button>
              
              <p className="mt-4 text-sm text-white/40">
                Practice with our AI coach trained on the S.T.E.A.L.T.H.™ methodology
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-mono text-white/50">LIVE SESSION</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className={isMuted ? "text-red-400" : "text-white/50"}
                  data-testid="button-mute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              <div className="min-h-[200px] max-h-[300px] overflow-y-auto space-y-3 px-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-[#ff7a1a]/20 border border-[#ff7a1a]/30"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <p className="text-sm text-white/90">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-[#ff7a1a]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <WaveformVisualization isActive={isRecording || isPlaying} />

              {!useTextMode ? (
                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing || isPlaying}
                    className={`rounded-full w-20 h-20 ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gradient-to-r from-[#ff7a1a] to-[#ffaa33] hover:from-[#ff8c3a] hover:to-[#ffbb44]"
                    }`}
                    data-testid="button-record"
                  >
                    {isRecording ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-black" />
                    )}
                  </Button>
                  
                  <p className="text-xs text-white/40">
                    {isRecording ? "Release to send" : "Tap to speak"}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setUseTextMode(true)}
                      className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1"
                      data-testid="button-switch-to-text"
                    >
                      <Keyboard className="w-3 h-3" />
                      Type instead
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisconnect}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      data-testid="button-end-session"
                    >
                      <PhoneOff className="w-3 h-3 mr-1" />
                      End
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 px-4">
                  <div className="flex gap-3">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your pitch..."
                      disabled={isProcessing}
                      className="flex-1 bg-[#0a0a0a] border-white/10 text-white placeholder:text-white/30"
                      data-testid="input-text-message"
                    />
                    <Button
                      onClick={handleTextSubmit}
                      disabled={isProcessing || !textInput.trim()}
                      className="bg-gradient-to-r from-[#ff7a1a] to-[#ffaa33] text-black"
                      data-testid="button-send-text"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setUseTextMode(false)}
                      className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1"
                      data-testid="button-switch-to-voice"
                    >
                      <Mic className="w-3 h-3" />
                      Use voice
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisconnect}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      data-testid="button-end-session-text"
                    >
                      <PhoneOff className="w-3 h-3 mr-1" />
                      End
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
