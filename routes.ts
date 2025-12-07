import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { requireAuth } from "./auth";
import { sendPipelinePackEmail } from "./resend";
import { 
  demoRequestSchema, 
  scriptScanSchema, 
  roiCalculatorSchema,
  analyticsEventSchema,
  adminLoginSchema,
  pipelineDemoSchema,
  type ScriptScanResult,
  type ROICalculatorResult,
  type PipelineDemoResult
} from "@shared/schema";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// System prompt for the voice AI coach
const VOICE_COACH_SYSTEM_PROMPT = `You are a Symmetri Growth Labs voice coach - an expert in B2B sales, cold calling, and outbound marketing. You help sales professionals practice and improve their scripts.

Your role:
1. When a user tries a cold call opener or script on you, respond AS IF you are the prospect they're calling
2. Be realistic - sometimes be busy, sometimes skeptical, sometimes interested
3. After each exchange, briefly note what worked and what could improve
4. You know Symmetri's methodology: pattern interrupts, signal-based selling, STEALTH protocol, and anti-AI-detection techniques

Key Symmetri concepts you know:
- TAM (Total Addressable Market) as ICP company count, not just revenue
- Pipeline Multiplier effect from autonomous outreach
- The "Silence of 2026" - AI-generated spam overwhelming inboxes
- Signal Processing - cutting through noise with relevant, personalized outreach
- S.T.E.A.L.T.H. protocol: Signal, Targeting, Engagement, Analysis, Learning, Timing, Harmonics

Respond conversationally and naturally. Keep responses concise (2-3 sentences when playing a prospect, 3-4 sentences when giving feedback). Be supportive but direct about improvements needed.`;

const spamTriggers = [
  "busy",
  "quick question",
  "just checking in",
  "guarantee",
  "free",
  "limited time",
  "just following up",
  "touch base",
  "wanted to reach out",
  "hope this finds you well",
  "do you have a minute",
  "are you the right person",
  "not trying to sell",
  "this is not a sales call",
  "special offer",
  "exclusive deal",
  "act now",
  "don't miss out",
];

function analyzeScript(script: string): ScriptScanResult {
  const lowerScript = script.toLowerCase();
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  let detectedTriggers = 0;
  
  spamTriggers.forEach(trigger => {
    if (lowerScript.includes(trigger)) {
      detectedTriggers++;
      issues.push(`Contains spam trigger phrase: "${trigger}"`);
    }
  });
  
  if (script.length < 50) {
    issues.push("Script is too short - lacks context and value proposition");
    suggestions.push("Add specific value proposition and context");
  }
  
  if (script.includes("?") && script.split("?").length > 3) {
    issues.push("Too many questions - can feel like an interrogation");
    suggestions.push("Limit to 1-2 focused questions");
  }
  
  if (lowerScript.includes("just")) {
    issues.push('Filler word "just" diminishes your message');
    suggestions.push('Remove filler words like "just" and "quick"');
  }
  
  if (!lowerScript.includes("you") && !lowerScript.includes("your")) {
    issues.push("Script is self-focused, not prospect-focused");
    suggestions.push("Lead with value for the prospect, not your product");
  }
  
  const score = Math.max(0, 100 - (detectedTriggers * 15) - (issues.length * 5));
  const passed = score >= 70;
  
  if (!passed) {
    suggestions.push("Use pattern interrupts instead of predictable openers");
    suggestions.push("Reference a specific trigger or signal about their company");
    suggestions.push("Lead with specific value, not permission-seeking");
  }
  
  const reframedScript = passed ? undefined : 
    "Hi [Name], I noticed [specific trigger about their company]. Companies like yours typically see [specific outcome]. Is that something worth a 10-minute call?";

  return {
    passed,
    score,
    issues: Array.from(new Set(issues)),
    suggestions: Array.from(new Set(suggestions)),
    reframedScript,
  };
}

function calculateROI(input: { 
  teamSize: number; 
  avgSalary: number; 
  hoursPerWeek: number; 
}): ROICalculatorResult {
  const { teamSize, avgSalary, hoursPerWeek } = input;
  
  const hourlyRate = avgSalary / 2080;
  const weeklyOutboundCost = teamSize * hoursPerWeek * hourlyRate;
  const monthlyOutboundCost = weeklyOutboundCost * 4.33;
  const annualOutboundCost = monthlyOutboundCost * 12;
  
  const automationEfficiency = 0.75;
  const hoursRecoveredPerMonth = Math.round(teamSize * hoursPerWeek * 4.33 * automationEfficiency);
  
  const currentMeetingsPerMonth = teamSize * 8;
  const multiplier = 2.5;
  const newMeetingsPerMonth = Math.round(currentMeetingsPerMonth * multiplier);
  const meetingsGained = newMeetingsPerMonth - currentMeetingsPerMonth;
  
  const costSavingsPercent = Math.round(automationEfficiency * 100);
  const monthlySavings = Math.round(monthlyOutboundCost * automationEfficiency);
  const annualSavings = Math.round(annualOutboundCost * automationEfficiency);

  return {
    hoursRecoveredPerMonth,
    meetingsGained,
    costSavingsPercent,
    monthlySavings,
    annualSavings,
    currentMeetingsPerMonth,
    newMeetingsPerMonth,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/demo-request", async (req, res) => {
    try {
      const validatedData = demoRequestSchema.parse(req.body);
      const record = await storage.createDemoRequest(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Demo request submitted successfully",
        id: record.id 
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ 
          success: false, 
          message: "Invalid request data",
          errors: (error as any).errors 
        });
      } else {
        console.error("Demo request error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit demo request" 
        });
      }
    }
  });

  app.post("/api/script-scan", async (req, res) => {
    try {
      const validatedData = scriptScanSchema.parse(req.body);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = analyzeScript(validatedData.script);
      res.json({ success: true, result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ 
          success: false, 
          message: "Invalid script data",
          errors: (error as any).errors 
        });
      } else {
        console.error("Script scan error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to scan script" 
        });
      }
    }
  });

  app.post("/api/roi-calculate", async (req, res) => {
    try {
      const validatedData = roiCalculatorSchema.parse(req.body);
      const result = calculateROI(validatedData);
      res.json({ success: true, result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ 
          success: false, 
          message: "Invalid calculator data",
          errors: (error as any).errors 
        });
      } else {
        console.error("ROI calculation error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to calculate ROI" 
        });
      }
    }
  });

  // Pipeline Simulator endpoint - based on real agentic outreach KPIs
  app.post("/api/simulate-revenue", async (req, res) => {
    try {
      const { tam, avgDealValue, teamSize } = req.body;
      
      // Simulate processing delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      
      res.json({ 
        success: true, 
        result: {
          dailyConversations: totalDailyConversations,
          monthlyMeetings: monthlyMeetings,
          monthlyPipelineValue: monthlyPipelineValue,
          pipelineMultiplier: Math.round(multiplier * 10) / 10,
          marketCoverageDays: marketCoverageDays,
          traditionalMeetings: traditionalMonthlyMeetings,
        }
      });
    } catch (error) {
      console.error("Revenue simulation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to run simulation" 
      });
    }
  });

  // Blueprint download (email capture) with email delivery
  app.post("/api/blueprint-download", async (req, res) => {
    try {
      const { email, simulationData } = req.body;
      
      // Store the lead for follow-up
      await storage.createDemoRequest({
        name: "Blueprint Download",
        email,
        company: simulationData?.yourCompany || "",
        teamSize: simulationData?.teamSize?.toString(),
        message: simulationData?.type === "pipeline_activation_pack"
          ? `Pipeline Pack: ${simulationData?.yourCompany} → ${simulationData?.targetPersona} at ${simulationData?.prospectCompany}`
          : `Pipeline Simulation: TAM ${simulationData?.tam?.toLocaleString()} ICP companies, Avg Deal Value $${simulationData?.avgDealValue?.toLocaleString()}, Monthly Pipeline $${simulationData?.results?.monthlyPipelineValue?.toLocaleString()}, ${simulationData?.results?.pipelineMultiplier}x Multiplier`,
      });
      
      // Track analytics event
      await storage.createAnalyticsEvent({
        eventType: "blueprint_download",
        eventData: { email, simulationData },
        sessionId: req.body.sessionId,
        visitorId: req.body.visitorId,
        pageUrl: req.body.pageUrl,
      });
      
      // Send Pipeline Activation Pack email if we have the full data
      if (simulationData?.type === "pipeline_activation_pack" && simulationData?.results) {
        const emailResult = await sendPipelinePackEmail(email, {
          yourCompany: simulationData.yourCompany || "",
          yourProduct: simulationData.yourProduct || "",
          targetPersona: simulationData.targetPersona || "",
          prospectCompany: simulationData.prospectCompany || "",
          research: simulationData.results.research || {
            companyOverview: "",
            keyTriggers: [],
            painPoints: [],
            competitiveInsights: []
          },
          email: simulationData.results.email || { subject: "", body: "" },
          linkedinMessage: simulationData.results.linkedinMessage || "",
          stealthScript: simulationData.results.stealthScript
        });
        
        if (!emailResult.success) {
          console.error("Failed to send Pipeline Pack email:", emailResult.error);
          // Still return success - lead is captured, just email failed
        }
      }
      
      res.json({ success: true, message: "Blueprint request received" });
    } catch (error) {
      console.error("Blueprint download error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process blueprint request" 
      });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Voice AI Chat endpoint
  app.post("/api/voice-chat", async (req, res) => {
    try {
      const { message, conversationHistory, sessionId } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ 
          success: false, 
          message: "Message is required" 
        });
      }

      // Demo fallback responses when OpenAI is not configured
      const demoResponses = [
        "Hmm, interesting opener. I'm actually in the middle of something - what's this about exactly?",
        "Wait, how did you know we were looking at that? Actually, tell me more about what you're seeing.",
        "I get a lot of these calls. What makes you different from the dozen other vendors I talked to this week?",
        "That's a bold claim. Can you back it up with actual numbers from companies like ours?",
        "Okay, you have my attention for about 30 seconds. What's your one big thing?",
      ];

      if (!openai) {
        // Demo mode - return scripted responses
        const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        
        return res.json({
          success: true,
          response: randomResponse,
          audioUrl: null,
          isDemo: true
        });
      }

      // Build conversation with system prompt
      const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
        { role: "system", content: VOICE_COACH_SYSTEM_PROMPT }
      ];

      // Add conversation history if provided
      if (Array.isArray(conversationHistory)) {
        conversationHistory.slice(-10).forEach((msg: { role: string; content: string }) => {
          if (msg.role === "user" || msg.role === "assistant") {
            messages.push({ role: msg.role, content: msg.content });
          }
        });
      }

      // Add current message
      messages.push({ role: "user", content: message });

      // Call GPT-5 for response
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages,
        max_completion_tokens: 500,
      });

      const aiResponse = completion.choices[0]?.message?.content || "I didn't quite catch that. Could you try again?";

      // Generate TTS audio for the response
      let audioUrl = null;
      try {
        const ttsResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: "onyx",
          input: aiResponse,
        });
        
        // Convert to base64 data URL
        const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
        audioUrl = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;
      } catch (ttsError) {
        console.error("TTS generation failed:", ttsError);
        // Continue without audio - text response still works
      }

      res.json({
        success: true,
        response: aiResponse,
        audioUrl,
        isDemo: false
      });

    } catch (error) {
      console.error("Voice chat error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process voice chat" 
      });
    }
  });

  // Pipeline Demo endpoint - generates STEALTH-certified personalized outreach content
  app.post("/api/pipeline-demo", async (req, res) => {
    try {
      const validatedData = pipelineDemoSchema.parse(req.body);
      const { yourCompany, yourProduct, targetPersona, prospectCompany } = validatedData;

      // STEALTH-certified demo fallback when OpenAI is not configured
      const demoResult: PipelineDemoResult = {
        research: {
          companyOverview: `${prospectCompany} operates in a competitive market with recent signals indicating growth-stage challenges typical of scaling organizations.`,
          keyTriggers: [
            `${prospectCompany} posted 3 revenue-focused roles in past 30 days`,
            "Leadership published content about scaling operational efficiency",
            "Recent funding/expansion announcement signals growth investment"
          ],
          painPoints: [
            "SDR team spending 60%+ of time on manual research vs. selling",
            "Low response rates on outbound despite high activity volume",
            "Difficulty breaking through to decision-makers at target accounts"
          ],
          competitiveInsights: [
            "Competitors using AI-augmented outreach seeing 2-3x meeting rates",
            "Industry shift toward signal-based selling vs. spray-and-pray",
            "Buyers increasingly filtering generic outreach before it reaches them"
          ],
          relevance: `${targetPersona}s at ${prospectCompany} are measured on pipeline generation efficiency. The current market rewards precision over volume—making ${yourProduct} directly relevant to their KPIs.`
        },
        linkedinMessage: `Saw ${prospectCompany}'s recent expansion—scaling revenue teams is no joke. Curious how you're thinking about outbound efficiency as you grow?`,
        email: {
          subject: `${prospectCompany}'s outbound numbers`,
          body: `${targetPersona.split(' ').pop() || 'Hey'},

Noticed ${prospectCompany} is hiring aggressively on the revenue side—usually means the pressure to hit pipeline targets just doubled.

Most teams I talk to are stuck in the same loop: reps spending half their day on research, the other half sending messages that get ignored. Meanwhile, AI-powered spam is making buyers tune out everything.

At ${yourCompany}, we help teams like yours flip that equation—${yourProduct.slice(0, 100)}.

Companies running our system are seeing 2-3x more qualified meetings without adding headcount.

Worth a 15-minute look?`
        },
        stealthScript: {
          opener: `${targetPersona.split(' ').pop() || 'Hey'}, this is [Your Name] from ${yourCompany}. I'm calling because I noticed ${prospectCompany} just posted several revenue roles—sounds like you're scaling fast.`,
          bridge: `I was just speaking with a ${targetPersona} at a similar company who mentioned their biggest challenge right now is getting reps to spend more time selling and less time researching.`,
          valueHook: `We help teams generate 2-3x more qualified meetings by eliminating the manual research bottleneck. Most of our clients see results in the first 30 days.`,
          closeQuestion: `Is that something that's on your radar right now, or am I completely off base?`,
          fullScript: `${targetPersona.split(' ').pop() || 'Hey'}, this is [Your Name] from ${yourCompany}. I'm calling because I noticed ${prospectCompany} just posted several revenue roles—sounds like you're scaling fast.

I was just speaking with a ${targetPersona} at a similar company who mentioned their biggest challenge right now is getting reps to spend more time selling and less time researching.

We help teams generate 2-3x more qualified meetings by eliminating the manual research bottleneck. Most of our clients see results in the first 30 days.

Is that something that's on your radar right now, or am I completely off base?`
        },
        isDemo: true
      };

      if (!openai) {
        // Demo mode - return STEALTH-certified scripted response
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
        return res.json({ success: true, result: demoResult });
      }

      // STEALTH-certified GPT prompt with full methodology
      const systemPrompt = `You are an expert B2B sales copywriter trained in the STEALTH™ methodology—AI-resistant cold calling and outreach that bypasses spam detection while being irresistible to humans.

STEALTH™ PRINCIPLES (you MUST follow these):
- S: STRATEGIC - Use specific triggers, not generic openers
- T: TONALITY - Write conversationally, like texting a colleague
- E: ELIMINATE spam triggers - NO "just checking in", "hope this finds you well", "quick question", "reaching out", "following up", "busy?", "free", "guarantee"
- A: AUTHENTIC - Use pattern interrupts, peer references, contextual bridges
- L: LANGUAGE Reframing - Lead with value, not permission-seeking
- T: TIMING - Get to the point immediately
- H: HUMAN-LIKE - Avoid AI-generated sounding text

EMAIL STYLE GUIDE:
- Tell a story rooted in the prospect's company context
- Use deep insights and specific examples, no throwaway lines
- Casual, human tone—avoid formal or robotic language
- First paragraph under 65 words
- No filler phrases whatsoever
- Favor specificity over generalities

SUBJECT LINE STYLE GUIDE:
- Short, casual, and engaging
- Use specific reference to prospect's company or context
- NO generic phrases like "Follow-up" or "Quick question"
- NO spam words, emojis, or placeholders

LINKEDIN MESSAGE STYLE GUIDE:
- Write like texting a friendly acquaintance, NOT a formal email
- 1-3 sentences maximum
- Make it easy to reply (yes/no or quick thought)
- Reference something specific about them
- Lead with curiosity or light, open-ended question
- Absolutely NO filler phrases

COLD CALL SCRIPT (STEALTH™ CERTIFIED):
- Opener: State name, company, and SPECIFIC trigger about their company (no "how are you?")
- Bridge: "I was just speaking with [Similar Role] at [Similar Company]" format
- Value Hook: One specific, measurable benefit
- Close: Permission-based but direct question

Return JSON only, no explanation.`;

      const userPrompt = `Generate STEALTH™-certified personalized outreach content for:

MY COMPANY: ${yourCompany}
WHAT I SELL: ${yourProduct}
TARGET PERSONA: ${targetPersona}
PROSPECT COMPANY: ${prospectCompany}

Return this exact JSON structure:
{
  "research": {
    "companyOverview": "1-2 sentence overview with specific market position",
    "keyTriggers": ["specific signal 1", "specific signal 2", "specific signal 3"],
    "painPoints": ["specific pain with metrics if possible", "pain2", "pain3"],
    "competitiveInsights": ["market trend insight", "competitor intelligence", "industry shift"],
    "relevance": "Why this specific persona at this company would care about my product"
  },
  "linkedinMessage": "1-3 sentence friendly message following LinkedIn Style Guide (under 280 chars)",
  "email": {
    "subject": "Short, casual, engaging subject following Subject Line Style Guide",
    "body": "Full email body following Email Style Guide - first paragraph under 65 words, conversational, specific"
  },
  "stealthScript": {
    "opener": "STEALTH opener with specific trigger",
    "bridge": "Peer reference using 'I was just speaking with...' format",
    "valueHook": "One specific measurable benefit",
    "closeQuestion": "Direct but permission-based close",
    "fullScript": "Complete script combining all elements"
  }
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1200,
      });

      const aiContent = completion.choices[0]?.message?.content;
      if (!aiContent) {
        throw new Error("No response from AI");
      }

      const parsed = JSON.parse(aiContent);
      const result: PipelineDemoResult = {
        research: {
          companyOverview: parsed.research?.companyOverview || demoResult.research.companyOverview,
          keyTriggers: parsed.research?.keyTriggers || demoResult.research.keyTriggers,
          painPoints: parsed.research?.painPoints || demoResult.research.painPoints,
          competitiveInsights: parsed.research?.competitiveInsights || demoResult.research.competitiveInsights,
          relevance: parsed.research?.relevance || demoResult.research.relevance,
        },
        linkedinMessage: parsed.linkedinMessage || demoResult.linkedinMessage,
        email: parsed.email || demoResult.email,
        stealthScript: parsed.stealthScript || demoResult.stealthScript,
        isDemo: false
      };

      res.json({ success: true, result });

    } catch (error) {
      console.error("Pipeline demo error:", error);
      
      // Fallback to STEALTH demo content on error
      const { yourCompany, yourProduct, targetPersona, prospectCompany } = req.body;
      res.json({
        success: true,
        result: {
          research: {
            companyOverview: `${prospectCompany || 'This company'} shows growth-stage signals with recent hiring activity.`,
            keyTriggers: ["Recent revenue team hiring", "Published scaling content", "Market expansion signals"],
            painPoints: ["Manual research consuming rep time", "Low outbound response rates", "Difficulty reaching decision-makers"],
            competitiveInsights: ["Competitors adopting AI-augmented outreach", "Industry shifting to signal-based selling", "Buyers filtering generic messages"],
            relevance: "This prospect fits your ideal customer profile with strong timing signals."
          },
          linkedinMessage: `Saw ${prospectCompany || 'your company'}'s growth—curious how you're thinking about outbound efficiency as you scale?`,
          email: {
            subject: `${prospectCompany || 'Your team'}'s outbound numbers`,
            body: `Hey,\n\nNoticed some hiring activity on the revenue side—usually means pipeline pressure is real.\n\nAt ${yourCompany || 'our company'}, we help teams like yours ${yourProduct ? yourProduct.slice(0, 80) : 'scale more efficiently'}.\n\nMost clients see 2-3x more qualified meetings in 30 days.\n\nWorth a quick look?`
          },
          stealthScript: {
            opener: `Hey, this is [Your Name] from ${yourCompany || 'our company'}. I noticed ${prospectCompany || 'your company'} is scaling the revenue team—sounds like an exciting time.`,
            bridge: `I was just speaking with a ${targetPersona || 'revenue leader'} at a similar company who mentioned getting reps to sell more and research less was their biggest challenge.`,
            valueHook: `We help teams generate 2-3x more qualified meetings without adding headcount.`,
            closeQuestion: `Is that something on your radar, or am I off base?`,
            fullScript: `Hey, this is [Your Name] from ${yourCompany || 'our company'}. I noticed ${prospectCompany || 'your company'} is scaling the revenue team—sounds like an exciting time.\n\nI was just speaking with a ${targetPersona || 'revenue leader'} at a similar company who mentioned getting reps to sell more and research less was their biggest challenge.\n\nWe help teams generate 2-3x more qualified meetings without adding headcount.\n\nIs that something on your radar, or am I off base?`
          },
          isDemo: true
        }
      });
    }
  });

  // Audio transcription endpoint
  app.post("/api/transcribe", async (req, res) => {
    try {
      // For demo mode without OpenAI
      if (!openai) {
        return res.json({
          success: true,
          transcript: "Hi, I'm testing my cold call opener with you today.",
          isDemo: true
        });
      }

      // Note: Full audio transcription requires multer middleware for file uploads
      // For now, return a demo response - full implementation would parse FormData
      res.json({
        success: true,
        transcript: "Hi, this is a demo transcription. For full voice support, please configure your OpenAI API key.",
        isDemo: true
      });

    } catch (error) {
      console.error("Transcription error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to transcribe audio" 
      });
    }
  });

  // Analytics tracking endpoint
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const validatedData = analyticsEventSchema.parse(req.body);
      
      // Add request metadata
      const eventData = {
        ...validatedData,
        userAgent: req.headers["user-agent"] || undefined,
        referrer: req.headers.referer || undefined,
      };
      
      const event = await storage.createAnalyticsEvent(eventData);
      res.status(201).json({ success: true, eventId: event.id });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ 
          success: false, 
          message: "Invalid event data",
          errors: (error as any).errors 
        });
      } else {
        console.error("Analytics tracking error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to track event" 
        });
      }
    }
  });

  // Batch analytics tracking for performance
  app.post("/api/analytics/batch", async (req, res) => {
    try {
      const { events } = req.body;
      
      if (!Array.isArray(events)) {
        return res.status(400).json({ 
          success: false, 
          message: "Events must be an array" 
        });
      }
      
      const userAgent = req.headers["user-agent"] || undefined;
      const referrer = req.headers.referer || undefined;
      
      const results = await Promise.allSettled(
        events.map((event: any) => {
          const validatedData = analyticsEventSchema.parse(event);
          return storage.createAnalyticsEvent({
            ...validatedData,
            userAgent,
            referrer,
          });
        })
      );
      
      const successCount = results.filter(r => r.status === "fulfilled").length;
      res.status(201).json({ 
        success: true, 
        tracked: successCount,
        total: events.length 
      });
    } catch (error) {
      console.error("Batch analytics error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to track batch events" 
      });
    }
  });

  // ============ ADMIN AUTHENTICATION ROUTES ============
  
  // Admin login
  app.post("/api/admin/login", (req, res, next) => {
    try {
      adminLoginSchema.parse(req.body);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid login data" 
      });
    }
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Authentication error" 
        });
      }
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: info?.message || "Invalid credentials" 
        });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ 
            success: false, 
            message: "Login error" 
          });
        }
        
        return res.json({ 
          success: true, 
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          }
        });
      });
    })(req, res, next);
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Logout error" 
        });
      }
      res.json({ success: true });
    });
  });

  // Get current admin user
  app.get("/api/admin/me", requireAuth, (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated" 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  });

  // ============ PROTECTED ADMIN API ROUTES ============
  
  // Get all demo requests (admin only)
  app.get("/api/admin/demo-requests", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const [requests, total] = await Promise.all([
        storage.getDemoRequests(limit, offset),
        storage.getDemoRequestCount(),
      ]);
      
      res.json({ 
        success: true, 
        data: requests,
        pagination: {
          limit,
          offset,
          total,
        }
      });
    } catch (error) {
      console.error("Error fetching demo requests:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch demo requests" 
      });
    }
  });

  // Get analytics summary (admin only)
  app.get("/api/admin/analytics/summary", requireAuth, async (req, res) => {
    try {
      const eventCounts = await storage.getEventCounts();
      
      res.json({ 
        success: true, 
        data: eventCounts,
      });
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch analytics summary" 
      });
    }
  });

  // Get recent analytics events (admin only)
  app.get("/api/admin/analytics/events", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const eventType = req.query.eventType as string | undefined;
      
      const events = await storage.getAnalyticsEvents({
        eventType,
        limit,
      });
      
      res.json({ 
        success: true, 
        data: events,
      });
    } catch (error) {
      console.error("Error fetching analytics events:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch analytics events" 
      });
    }
  });

  // ============ A/B TESTING ROUTES ============
  
  // Get active experiments (public - for variant assignment)
  app.get("/api/experiments/active", async (req, res) => {
    try {
      const experiments = await storage.getActiveExperiments();
      res.json({ 
        success: true, 
        data: experiments,
      });
    } catch (error) {
      console.error("Error fetching experiments:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch experiments" 
      });
    }
  });

  // Get all experiments (admin only)
  app.get("/api/admin/experiments", requireAuth, async (req, res) => {
    try {
      const experiments = await storage.getActiveExperiments();
      res.json({ 
        success: true, 
        data: experiments,
      });
    } catch (error) {
      console.error("Error fetching experiments:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch experiments" 
      });
    }
  });

  // Create new experiment (admin only)
  app.post("/api/admin/experiments", requireAuth, async (req, res) => {
    try {
      const experiment = await storage.createExperiment(req.body);
      res.status(201).json({ 
        success: true, 
        data: experiment,
      });
    } catch (error) {
      console.error("Error creating experiment:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create experiment" 
      });
    }
  });

  // Update experiment (admin only)
  app.patch("/api/admin/experiments/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experiment = await storage.updateExperiment(id, req.body);
      
      if (!experiment) {
        return res.status(404).json({ 
          success: false, 
          message: "Experiment not found" 
        });
      }
      
      res.json({ 
        success: true, 
        data: experiment,
      });
    } catch (error) {
      console.error("Error updating experiment:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update experiment" 
      });
    }
  });

  // Track experiment conversion
  app.post("/api/experiments/convert", async (req, res) => {
    try {
      const { experimentId, variantId, conversionType } = req.body;
      
      await storage.createAnalyticsEvent({
        eventType: "experiment_conversion",
        eventData: {
          experimentId,
          variantId,
          conversionType,
        },
        sessionId: req.body.sessionId,
        visitorId: req.body.visitorId,
        pageUrl: req.body.pageUrl,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking conversion:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to track conversion" 
      });
    }
  });

  return httpServer;
}
