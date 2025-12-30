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
      {/* Video background (optional) */}
      {(videoSrc || fallbackImage) && (
        <VideoBackground 
          videoSrc={videoSrc}
          fallbackImage={fallbackImage}
          overlayOpacity={0.75}
        />
      )}
      
      {/* Default scanning cone effect (shown when no video) */}
      {!videoSrc && !fallbackImage && <div className="scanning-cone" />}
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-6 animate-on-scroll v
