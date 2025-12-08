export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { yourCompany, yourProduct, targetPersona, prospectCompany } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are an expert B2B cold calling script writer trained in the S.T.E.A.L.T.H.™ methodology.

S.T.E.A.L.T.H.™ = AI-Resistant Cold Calling - "Be invisible to AI, irresistible to humans"

BANNED PHRASES (never use): "Just wondering if", "Sorry to bother you", "Are you busy?", "Free", "Guarantee", "Quick question", "Just checking in", "Hope this finds you well", "Reaching out", "Following up"

SCRIPT STRUCTURE:
1. OPENER: State their name confidently, your name/company, and a SPECIFIC trigger about THEIR company
2. BRIDGE: Use "I was just speaking with [Similar Role] at [Similar Company]" format
3. VALUE HOOK: ONE specific, measurable benefit with timeframe
4. CLOSE: Direct question that gives them an out

Return ONLY valid JSON with this structure:
{
  "research": {
    "companyOverview": "1-2 sentences about prospect company",
    "keyTriggers": ["signal 1", "signal 2", "signal 3"],
    "painPoints": ["pain 1", "pain 2", "pain 3"],
    "competitiveInsights": ["insight 1", "insight 2", "insight 3"],
    "relevance": "Why this persona would care"
  },
  "stealthScript": {
    "opener": "The opener",
    "bridge": "The bridge",
    "valueHook": "The value hook",
    "closeQuestion": "The close",
    "fullScript": "Complete script"
  },
  "linkedinMessage": "1-3 sentences, under 280 chars",
  "email": {
    "subject": "Short subject line",
    "body": "Email body"
  }
}`,
        messages: [
          {
            role: 'user',
            content: `Generate S.T.E.A.L.T.H.™ certified outreach for:
MY COMPANY: ${yourCompany}
WHAT I SELL: ${yourProduct}
TARGET PERSONA: ${targetPersona}
PROSPECT COMPANY: ${prospectCompany}

Return ONLY the JSON object.`,
          },
        ],
      }),
    });

    const data = await response.json();
    let result;
    
    try {
      const text = data.content[0].text;
      result = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    } catch {
      throw new Error('Failed to parse response');
    }

    return new Response(JSON.stringify({ success: true, result: { ...result, isDemo: false } }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: true,
      result: {
        research: {
          companyOverview: "Growth-stage company with recent hiring activity.",
          keyTriggers: ["Recent revenue team hiring", "Published scaling content", "Market expansion signals"],
          painPoints: ["Manual research consuming rep time", "Low outbound response rates", "Difficulty reaching decision-makers"],
          competitiveInsights: ["Competitors adopting AI outreach", "Industry shifting to signal-based selling", "Buyers filtering generic messages"],
          relevance: "Strong timing signals for your solution."
        },
        stealthScript: {
          opener: "Hey, this is [Your Name] from your company. I noticed they're scaling the revenue team.",
          bridge: "I was just speaking with a revenue leader at a similar company who mentioned getting reps to sell more and research less was their biggest challenge.",
          valueHook: "We help teams generate 2-3x more qualified meetings without adding headcount. Most clients see results in 30 days.",
          closeQuestion: "Is that something on your radar, or am I off base?",
          fullScript: "Hey, this is [Your Name]. I noticed the company is scaling fast. I was just speaking with a similar revenue leader who mentioned the research bottleneck. We help teams get 2-3x more meetings in 30 days. Is that on your radar?"
        },
        linkedinMessage: "Saw your company's growth—curious how you're thinking about outbound efficiency as you scale?",
        email: {
          subject: "Your outbound numbers",
          body: "Hey,\n\nNoticed some hiring activity on the revenue side—usually means pipeline pressure is real.\n\nWe help teams scale more efficiently. Most clients see 2-3x more qualified meetings in 30 days.\n\nWorth a quick look?"
        },
        isDemo: true
      }
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
