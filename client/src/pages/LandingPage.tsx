import { useState, useCallback, useEffect } from "react";
import { GridBackground } from "@/components/landing/GridBackground";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { MultiAgentPipelineSection } from "@/components/landing/MultiAgentPipelineSection";
import { AIParadoxSection } from "@/components/landing/AIParadoxSection";
import { GTMCollapseSection } from "@/components/landing/GTMCollapseSection";
import { RevenueOSSection } from "@/components/landing/RevenueOSSection";
import { TimelineSection } from "@/components/landing/TimelineSection";
import { StrikeChainSection } from "@/components/landing/StrikeChainSection";
import { DataEngineSection } from "@/components/landing/DataEngineSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { DemoRequestModal } from "@/components/landing/DemoRequestModal";
import { 
  useAnalytics, 
  useScrollDepthTracking, 
  useTimeOnPageTracking 
} from "@/hooks/use-analytics";

export default function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("cta");
  const { trackPageView, trackCTAClick, trackDemoModalOpen, trackDemoModalClose } = useAnalytics();
  
  useScrollDepthTracking();
  useTimeOnPageTracking();
  
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);
  
  const openDemoModal = useCallback((source: string) => {
    setModalSource(source);
    setDemoModalOpen(true);
    trackDemoModalOpen(source);
    trackCTAClick("book_demo", source);
  }, [trackDemoModalOpen, trackCTAClick]);
  
  const handleModalClose = useCallback((open: boolean) => {
    if (!open) {
      trackDemoModalClose(false);
    }
    setDemoModalOpen(open);
  }, [trackDemoModalClose]);
  
  const scrollToDemo = useCallback(() => {
    trackCTAClick("see_demo", "hero");
    const element = document.querySelector('[data-testid="multi-agent-pipeline-section"]');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [trackCTAClick]);
  
  const scrollToOS = useCallback(() => {
    trackCTAClick("see_os", "hero");
    const element = document.querySelector('[data-testid="revenue-os-section"]');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [trackCTAClick]);
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <GridBackground />
      <Header />
      
      <main className="relative z-10">
        <HeroSection 
          onCalculatorClick={scrollToDemo} 
          onDemoClick={scrollToDemo} 
        />
        <AIParadoxSection />
        <GTMCollapseSection />
        <MultiAgentPipelineSection />
        <RevenueOSSection />
        <StrikeChainSection />
        <DataEngineSection />
        <ComparisonSection />
        <TimelineSection />
        <PartnersSection />
        <CTASection 
          onBookSession={() => openDemoModal("cta")} 
          onWalkthrough={scrollToOS} 
        />
      </main>
      
      <Footer />
      
      <DemoRequestModal 
        open={demoModalOpen} 
        onOpenChange={handleModalClose}
        source={modalSource}
      />
    </div>
  );
}
