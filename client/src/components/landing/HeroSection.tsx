import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OSDiagram } from "./OSDiagram";
import { VideoBackground } from "./VideoBackground";
import { Zap, Play } from "lucide-react";
import { useHeroExperiment } from "@/hooks/use-experiments";

interface HeroSectionProps {
  onCalculatorClick: () => void;
  onDemoClick: () => void;
  videoSrc?: string;
  fallbackImage?: string;
}

export function HeroSection({ 
  onCalculatorClick, 
  onDemoClick,
  videoSrc,
  fallbackImage,
}: HeroSectionProps) {
  const { headline, subheadline, ctaText, ctaSecondaryText, trackConversion } = useHeroExperiment();
  
  const handleCalculatorClick = () => {
    trackConversion("cta_primary_click");
    onCalculatorClick();
  };
  
  const handleDemoClick = () => {
    trackConversion("cta_secondary_click");
    onDemoClick();
  };
  
  return (
    <section 
      className="relative min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      data-testid="hero-section"
    >
      {(videoSrc || fallbackImage) && (
        <VideoBackground 
          videoSrc={videoSrc}
          fallbackImage={fallbackImage}
          overlayOpacity={0.75}
        />
      )}
      
      {!videoSrc && !fallbackImage && <div className="scanning-cone" />}
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-6 animate-on-scroll visible">
            <Badge variant="symmetri" data-testid="badge-abm-outbound">GTM Transformation Partner</Badge>
            
            <h1 className="font-bold leading-tight tracking-tight">
              <span className="block text-white text-[40px] sm:text-[45px] lg:text-[50px]">You're Not Crazy.</span>
              <span className="block text-ember-gradient text-[40px] sm:text-[45px] lg:text-[50px] mt-[5px] mb-[5px]">The GTM Game Changed. Most Teams Didn't.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed">
              The old playbook is dead. Most teams are running it anyway. We wrote the new one.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#FF6600] to-[#FF4400] hover:from-[#FF5500] hover:to-[#FF3300] text-white font-semibold px-8 gap-2 glow-bioluminescent"
                onClick={handleDemoClick}
                data-testid="button-gtm-diagnostic"
              >
                <Zap className="w-5 h-5" />
                See How We Fix It
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-white hover:bg-white/5 font-semibold px-8 gap-2"
                onClick={() => window.open("https://calendar.app.google/tXjMUnVvDC4i8vq57", "_blank")}
                data-testid="button-see-how-it-works"
              >
                <Play className="w-5 h-5" />
                Book a Call
              </Button>
            </div>
            
            <p className="text-sm text-white/70 max-w-lg pt-2">
              Built for B2B sales teams that are stuck, stagnant, or behind—and need pipeline now, not in 18 months.
            </p>
          </div>
          
          <div className="flex justify-center lg:justify-end animate-on-scroll visible delay-300">
            <OSDiagram className="transform lg:scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
}
