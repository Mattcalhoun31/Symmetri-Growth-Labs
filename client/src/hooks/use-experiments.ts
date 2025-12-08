import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Experiment } from "@shared/schema";

interface Variant {
  id: string;
  name: string;
  weight: number;
  content: Record<string, string>;
}

interface AssignedVariant {
  experimentId: number;
  experimentName: string;
  variantId: string;
  variantName: string;
  content: Record<string, string>;
}

// Get or create visitor ID for consistent variant assignment
function getVisitorId(): string {
  const key = "symmetri_visitor_id";
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
}

// Get session ID
function getSessionId(): string {
  const key = "symmetri_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

// Deterministic variant assignment based on visitor ID
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function selectVariant(variants: Variant[], visitorId: string, experimentId: number): Variant {
  // Create deterministic hash from visitor ID and experiment ID
  const seed = hashCode(`${visitorId}-${experimentId}`);
  
  // Calculate total weight
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  
  // Select variant based on weighted probability
  const selection = seed % totalWeight;
  let cumulative = 0;
  
  for (const variant of variants) {
    cumulative += variant.weight;
    if (selection < cumulative) {
      return variant;
    }
  }
  
  return variants[0]; // Fallback to first variant
}

// Local storage key for assigned variants
const VARIANTS_KEY = "symmetri_ab_variants";

function getStoredVariants(): Record<string, string> {
  try {
    const stored = localStorage.getItem(VARIANTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function storeVariant(experimentId: number, variantId: string) {
  const variants = getStoredVariants();
  variants[experimentId.toString()] = variantId;
  localStorage.setItem(VARIANTS_KEY, JSON.stringify(variants));
}

export function useExperiments() {
  const [assignedVariants, setAssignedVariants] = useState<AssignedVariant[]>([]);
  const visitorId = getVisitorId();

  // Fetch active experiments
  const { data: experimentsData, isLoading } = useQuery<{
    success: boolean;
    data: Experiment[];
  }>({
    queryKey: ["/api/experiments/active"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Track experiment view
  const viewMutation = useMutation({
    mutationFn: async ({ experimentId, variantId }: { experimentId: number; variantId: string }) => {
      return apiRequest("POST", "/api/analytics/track", {
        eventType: "experiment_view",
        eventData: { experimentId, variantId },
        sessionId: getSessionId(),
        visitorId,
        pageUrl: window.location.href,
      });
    },
  });

  // Track conversion
  const conversionMutation = useMutation({
    mutationFn: async ({ 
      experimentId, 
      variantId, 
      conversionType 
    }: { 
      experimentId: number; 
      variantId: string; 
      conversionType: string;
    }) => {
      return apiRequest("POST", "/api/experiments/convert", {
        experimentId,
        variantId,
        conversionType,
        sessionId: getSessionId(),
        visitorId,
        pageUrl: window.location.href,
      });
    },
  });

  // Assign variants when experiments are loaded
  useEffect(() => {
    if (!experimentsData?.data || experimentsData.data.length === 0) return;

    const storedVariants = getStoredVariants();
    const assigned: AssignedVariant[] = [];

    for (const experiment of experimentsData.data) {
      if (!experiment.isActive) continue;

      const variants = experiment.variants as Variant[];
      if (!variants || variants.length === 0) continue;

      // Check if we already have an assigned variant
      let assignedVariantId = storedVariants[experiment.id.toString()];
      let selectedVariant: Variant | undefined;

      if (assignedVariantId) {
        // Use existing assignment
        selectedVariant = variants.find(v => v.id === assignedVariantId);
      }

      if (!selectedVariant) {
        // Assign new variant
        selectedVariant = selectVariant(variants, visitorId, experiment.id);
        storeVariant(experiment.id, selectedVariant.id);
        
        // Track view
        viewMutation.mutate({ 
          experimentId: experiment.id, 
          variantId: selectedVariant.id 
        });
      }

      assigned.push({
        experimentId: experiment.id,
        experimentName: experiment.name,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
        content: selectedVariant.content,
      });
    }

    setAssignedVariants(assigned);
  }, [experimentsData, visitorId]);

  // Get variant for a specific experiment
  const getVariant = useCallback((experimentName: string): AssignedVariant | undefined => {
    return assignedVariants.find(v => v.experimentName === experimentName);
  }, [assignedVariants]);

  // Get content value for an experiment
  const getContent = useCallback((experimentName: string, contentKey: string, defaultValue: string): string => {
    const variant = getVariant(experimentName);
    return variant?.content[contentKey] || defaultValue;
  }, [getVariant]);

  // Track conversion event
  const trackConversion = useCallback((experimentName: string, conversionType: string) => {
    const variant = getVariant(experimentName);
    if (variant) {
      conversionMutation.mutate({
        experimentId: variant.experimentId,
        variantId: variant.variantId,
        conversionType,
      });
    }
  }, [getVariant, conversionMutation]);

  return {
    isLoading,
    assignedVariants,
    getVariant,
    getContent,
    trackConversion,
  };
}

// Hook for specific hero experiment
export function useHeroExperiment() {
  const { getContent, trackConversion, isLoading } = useExperiments();

  // Default hero content
  const defaultContent = {
    headline: "Autonomous Revenue Engine.",
    subheadline: "Modern Sales Outreach Made Simple.",
    ctaText: "Calculate Your Savings",
    ctaSecondaryText: "See the OS in Action",
  };

  return {
    isLoading,
    headline: getContent("hero_copy", "headline", defaultContent.headline),
    subheadline: getContent("hero_copy", "subheadline", defaultContent.subheadline),
    ctaText: getContent("hero_copy", "ctaText", defaultContent.ctaText),
    ctaSecondaryText: getContent("hero_copy", "ctaSecondaryText", defaultContent.ctaSecondaryText),
    trackConversion: (type: string) => trackConversion("hero_copy", type),
  };
}
