import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator, Clock, Calendar, DollarSign, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { ROICalculatorResult } from "@shared/schema";

export function ROICalculatorSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  
  const [teamSize, setTeamSize] = useState(5);
  const [avgSalary, setAvgSalary] = useState(75000);
  const [hoursPerWeek, setHoursPerWeek] = useState(25);
  const [calculations, setCalculations] = useState<ROICalculatorResult>({
    hoursRecoveredPerMonth: 406,
    meetingsGained: 60,
    costSavingsPercent: 75,
    monthlySavings: 2936,
    annualSavings: 35232,
    currentMeetingsPerMonth: 40,
    newMeetingsPerMonth: 100,
  });

  const [hasError, setHasError] = useState(false);
  
  const roiMutation = useMutation({
    mutationFn: async (params: { teamSize: number; avgSalary: number; hoursPerWeek: number }) => {
      const response = await apiRequest("POST", "/api/roi-calculate", params);
      const data = await response.json();
      return data.result as ROICalculatorResult;
    },
    onSuccess: (result) => {
      setCalculations(result);
      setHasError(false);
    },
    onError: () => {
      setHasError(true);
    },
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      roiMutation.mutate({ teamSize, avgSalary, hoursPerWeek });
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [teamSize, avgSalary, hoursPerWeek]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section 
      ref={ref}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-testid="roi-calculator-section"
    >
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 animate-on-scroll ${isVisible ? "visible" : ""}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">AI Agents vs.</span>
            <br />
            <span className="text-ember-gradient">Human Capital</span>
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            See the real cost of manual outbound vs. an autonomous Revenue Engine.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className={`basalt-panel ember-edge-glow rounded-xl animate-on-scroll ${isVisible ? "visible" : ""} delay-100`}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#ff7a1a]" />
                Calculate Your Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm text-white/80">Team members doing outbound</label>
                  <span className="text-lg font-bold text-white">{teamSize}</span>
                </div>
                <Slider
                  value={[teamSize]}
                  onValueChange={(v) => setTeamSize(v[0])}
                  min={1}
                  max={20}
                  step={1}
                  className="py-2"
                  data-testid="slider-team-size"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm text-white/80">Average salary (per person)</label>
                  <span className="text-lg font-bold text-white">{formatCurrency(avgSalary)}</span>
                </div>
                <Slider
                  value={[avgSalary]}
                  onValueChange={(v) => setAvgSalary(v[0])}
                  min={40000}
                  max={150000}
                  step={5000}
                  className="py-2"
                  data-testid="slider-avg-salary"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm text-white/80">Hours per week on outbound</label>
                  <span className="text-lg font-bold text-white">{hoursPerWeek}h</span>
                </div>
                <Slider
                  value={[hoursPerWeek]}
                  onValueChange={(v) => setHoursPerWeek(v[0])}
                  min={5}
                  max={40}
                  step={5}
                  className="py-2"
                  data-testid="slider-hours-per-week"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`basalt-panel ember-edge-glow rounded-xl animate-on-scroll ${isVisible ? "visible" : ""} delay-200`}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#ffaa33]" />
                Your Estimated Results
                {roiMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin text-[#ffaa33] ml-auto" />
                )}
              </CardTitle>
              {hasError && (
                <div className="flex items-center gap-2 text-sm text-red-400 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  Calculation failed - showing cached results
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="basalt-panel p-4">
                  <Clock className="w-5 h-5 text-[#ffaa33] mb-2" />
                  <div className="text-3xl font-bold text-white">
                    {calculations.hoursRecoveredPerMonth.toLocaleString()}
                  </div>
                  <p className="text-sm text-white/70">Hours recovered / month</p>
                </div>
                
                <div className="basalt-panel p-4">
                  <Calendar className="w-5 h-5 text-[#ff7a1a] mb-2" />
                  <div className="text-3xl font-bold text-white">
                    +{calculations.meetingsGained}
                  </div>
                  <p className="text-sm text-white/70">Meetings gained / month</p>
                </div>
              </div>
              
              <div className="basalt-panel p-4">
                <DollarSign className="w-5 h-5 text-[#ffaa33] mb-2" />
                <div className="text-4xl font-bold text-gradient-orange">
                  {calculations.costSavingsPercent}%
                </div>
                <p className="text-white/70">Potential outbound cost savings</p>
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between text-sm">
                  <span className="text-white/60">Monthly savings:</span>
                  <span className="text-white font-medium">{formatCurrency(calculations.monthlySavings)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/60">Annual savings:</span>
                  <span className="text-gradient-orange font-bold">{formatCurrency(calculations.annualSavings)}</span>
                </div>
              </div>
              
              <div className="text-center pt-2">
                <div className="text-sm text-white/60 mb-1">Meeting projection</div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-white/60">{calculations.currentMeetingsPerMonth}/mo</span>
                  <span className="text-[#ff7a1a]">→</span>
                  <span className="text-xl font-bold text-white">{calculations.newMeetingsPerMonth}/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <p className={`text-center text-white/80 mt-8 max-w-2xl mx-auto animate-on-scroll ${isVisible ? "visible" : ""} delay-300`}>
          Most teams save 60–85% on outbound labor while increasing meetings by 2–3× once the Engine is fully live.
        </p>
      </div>
    </section>
  );
}
