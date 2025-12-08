import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const STEALTH_SYSTEM_PROMPT = `You are an expert B2B cold calling script writer trained in the S.T.E.A.L.T.H.™ methodology developed by Matt Calhoun at Symmetri Growth Labs.

S.T.E.A.L.T.H.™ = AI-Resistant Cold Calling
"Be invisible to AI, irresistible to humans"

THE S.T.E.A.L.T.H.™ FRAMEWORK:

S = STRATEGIC Call Pattern Management
- Use specific triggers about their company, not generic openers
- Reference recent hiring, funding, expansion, or published content

T = TONALITY Optimization for AI Scoring  
- Write for confident, steady delivery at 150-160 words per minute
- No uptalk or questioning tone - project authority
- Natural pause patterns, not rushed or hesitant

E = ELIMINATE Spam Trigger Language
BANNED PHRASES (never use these):
- "Just wondering if..." → Use "I'm calling because..."
- "Sorry to bother you" → Use "I have information about..."
- "Are you busy?" → Use "Is this a good time to discuss..."
- "Free," "Guarantee" → Use "Complimentary," "Included"
- "Um," "Uh," "Like" → Use [Silent pause, then continue]
- "Quick question" → NEVER use
- "Just checking in" → NEVER use
- "Hope this finds you well" → NEVER use
- "Reaching out" → NEVER use
- "Following up" → NEVER use

A = AUTHENTIC Conversation Techniques
Pattern Interrupt Strategies:

1. Assumption Reversal
   - Instead of: "Hi, is this John?"
   - S.T.E.A.L.T.H.™: "John, I'm calling because..."
   - Why: Eliminates uncertainty, projects confidence

2. Contextual Bridge  
   - Instead of: "I hope I'm not catching you at a bad time"
   - S.T.E.A.L.T.H.™: "I'm calling about [specific topic] affecting [their industry]"
   - Why: Immediate context, demonstrates preparation

3. Peer Reference
   - Instead of: "I'm calling from [Company Name]"
   - S.T.E.A.L.T.H.™: "I was just speaking with [Similar Role] at [Similar Company]"
   - Why: Social proof, reduces sales resistance

L = LANGUAGE Reframing Mastery
The S.T.E.A.L.T.H.™ BRIDGE Framework:
- Build Rapport Quickly
- Reveal Relevant Insight
- Identify their Situation
- Demonstrate Understanding
- Guide to Next Step
- End with Professionalism

Core Reframes:
- Interruption → Invitation: "I have something that might interest you..."
- Request → Offer: "I have insights that could save you [benefit]"
- Sales → Consultation: "I've been helping companies like yours solve [problem]"

T = TIMING and Volume Control
- Tuesday-Thursday: Highest answer rates
- 10:00 AM - 11:30 AM: Peak engagement window
- 2:00 PM - 4:00 PM: Secondary optimal window

H = HUMAN-LIKE Delivery Training
- Confidence Calibration: Steady pitch and tone
- Pace Optimization: Natural rhythm
- Stress Elimination: No vocal stress indicators
- Emotional Congruence: Tone matches message

SCRIPT STRUCTURE (you MUST follow this):

1. OPENER (2-3 sentences max):
   - State their name confidently (no "Is this...?")
   - Your name and company
   - SPECIFIC trigger about THEIR company (hiring, funding, news, expansion)
   - Example: "Sarah, this is [Name] from [Company]. I'm calling because I noticed [Prospect Company] just posted three revenue roles—sounds like you're scaling fast."

2. BRIDGE (1-2 sentences):
   - Use peer reference format: "I was just speaking with [Similar Role] at [Similar Company]"
   - Connect to a common challenge
   - Example: "I was just speaking with a VP of Sales at a similar company who mentioned their biggest challenge is getting reps to spend more time selling and less time researching."

3. VALUE HOOK (1-2 sentences):
   - ONE specific, measurable benefit
   - Include timeframe if possible
   - Example: "We help teams generate 2-3x more qualified meetings by eliminating the manual research bottleneck. Most clients see results in the first 30 days."

4. CLOSE QUESTION (1 sentence):
   - Direct but gives them an out
   - Example: "Is that something on your radar right now, or am I completely off base?"

PROVEN S.T.E.A.L.T.H.™ RESULTS:
- 70% reduction in hang-ups when eliminating "Are you busy?" openers
- 50% increase in positive responses by removing apologetic language
- 28% more meetings booked by avoiding tentative opening phrases
- 17-20% reduction in spam flags by eliminating trigger words

OUTPUT FORMAT:
Return ONLY valid JSON with this exact structure, no explanation or markdown:
{
  "research": {
    "companyOverview": "1-2 sentence specific overview of the prospect company",
    "keyTriggers": ["specific signal 1", "specific signal 2", "specific signal 3"],
    "painPoints": ["specific pain with metrics", "pain 2", "pain 3"],
    "competitiveInsights": ["market trend", "competitor intel", "industry shift"],
    "relevance": "Why this persona at this company would care about the product"
  },
  "stealthScript": {
    "opener": "The S.T.E.A.L.T.H.™ opener with specific trigger",
    "bridge": "Peer reference using 'I was just speaking with...' format",
    "valueHook": "One specific measurable benefit with timeframe",
    "closeQuestion": "Direct close that gives them an out",
    "fullScript": "Complete script combining all 4 elements naturally"
  },
  "linkedinMessage": "1-3 sentence casual message, under 280 chars, like texting a colleague",
  "email": {
    "subject": "Short, specific subject referencing their company (no spam words)",
    "body": "Full email: first paragraph under 65 words, conversational, specific to their situation"
  }
}`;

export default async function handler(request: Request) {
  // Handle CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { yourCompany, yourProduct, targetPersona, prospectCompany } =
      await request.json();

    if (!yourCompany || !yourProduct || !targetPersona || !prospectCompany) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userPrompt = `Generate S.T.E.A.L.T.H.™-certified personalized cold call script and outreach content for:

MY COMPANY: ${yourCompany}
WHAT I SELL: ${yourProduct}
TARGET PERSONA: ${targetPersona}
PROSPECT COMPANY: ${prospectCompany}

Remember:
- The opener MUST reference something SPECIFIC about ${prospectCompany} (hiring, funding, news, expansion)
- Use the peer reference format in the bridge
- NO banned phrases (just, sorry, busy, free, guarantee, quick question, etc.)
- The full script should flow naturally when read aloud
- Keep LinkedIn message under 280 characters
- Email first paragraph under 65 words

Return ONLY the JSON object, no other text.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: STEALTH_SYSTEM_PROMPT,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse the JSON response
    let result;
    try {
      // Clean up the response in case there's any markdown
      let jsonText = content.text.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.slice(7);
      }
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.slice(0, -3);
      }
      result = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", content.text);
      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: {
          ...result,
          isDemo: false,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Pipeline demo error:", error);

    // Return fallback demo content on error
    const { yourCompany, yourProduct, targetPersona, prospectCompany } =
      await request.json().catch(() => ({}));

    return new Response(
      JSON.stringify({
        success: true,
        result: {
          research: {
            companyOverview: `${prospectCompany || "This company"} shows growth-stage signals with recent hiring activity.`,
            keyTriggers: [
              "Recent revenue team hiring",
              "Published scaling content",
              "Market expansion signals",
            ],
            painPoints: [
              "Manual research consuming rep time",
              "Low outbound response rates",
              "Difficulty reaching decision-makers",
            ],
            competitiveInsights: [
              "Competitors adopting AI-augmented outreach",
              "Industry shifting to signal-based selling",
              "Buyers filtering generic messages",
            ],
            relevance:
              "This prospect fits your ideal customer profile with strong timing signals.",
          },
          stealthScript: {
            opener: `${targetPersona?.split(" ").pop() || "Hey"}, this is [Your Name] from ${yourCompany || "our company"}. I'm calling because I noticed ${prospectCompany || "your company"} just posted several revenue roles—sounds like you're scaling fast.`,
            bridge: `I was just speaking with a ${targetPersona || "revenue leader"} at a similar company who mentioned their biggest challenge is getting reps to spend more time selling and less time researching.`,
            valueHook: `We help teams generate 2-3x more qualified meetings by eliminating the manual research bottleneck. Most clients see results in the first 30 days.`,
            closeQuestion: `Is that something on your radar right now, or am I completely off base?`,
            fullScript: `${targetPersona?.split(" ").pop() || "Hey"}, this is [Your Name] from ${yourCompany || "our company"}. I'm calling because I noticed ${prospectCompany || "your company"} just posted several revenue roles—sounds like you're scaling fast.\n\nI was just speaking with a ${targetPersona || "revenue leader"} at a similar company who mentioned their biggest challenge is getting reps to spend more time selling and less time researching.\n\nWe help teams generate 2-3x more qualified meetings by eliminating the manual research bottleneck. Most clients see results in the first 30 days.\n\nIs that something on your radar right now, or am I completely off base?`,
          },
          linkedinMessage: `Saw ${prospectCompany || "your company"}'s growth—curious how you're thinking about outbound efficiency as you scale?`,
          email: {
            subject: `${prospectCompany || "Your team"}'s outbound numbers`,
            body: `Hey,\n\nNoticed some hiring activity on the revenue side—usually means pipeline pressure is real.\n\nAt ${yourCompany || "our company"}, we help teams like yours ${yourProduct ? yourProduct.slice(0, 80) : "scale more efficiently"}.\n\nMost clients see 2-3x more qualified meetings in 30 days.\n\nWorth a quick look?`,
          },
          isDemo: true,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
