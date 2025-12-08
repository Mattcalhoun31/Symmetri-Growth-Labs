export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { yourCompany, yourProduct, targetPersona, prospectCompany } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are an expert B2B cold calling script writer using S.T.E.A.L.T.H.™ methodology. BANNED PHRASES: "Just wondering", "Sorry to bother", "Are you busy?", "Free", "Guarantee", "Quick question". Return ONLY valid JSON with: research (companyOverview, keyTriggers[], painPoints[], competitiveInsights[], relevance), stealthScript (opener, bridge, valueHook, closeQuestion, fullScript), linkedinMessage, email (subject, body).`,
        messages: [{
          role: 'user',
          content: `Generate S.T.E.A.L.T.H.™ outreach for: Company: ${yourCompany}, Product: ${yourProduct}, Persona: ${targetPersona}, Prospect: ${prospectCompany}. Return ONLY JSON.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const result = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());

    return res.status(200).json({ success: true, result: { ...result, isDemo: false } });
  } catch (error) {
    return res.status(200).json({
      success: true,
      result: {
        research: {
          companyOverview: `${prospectCompany} shows growth signals.`,
          keyTriggers: ["Revenue team hiring", "Scaling content", "Expansion signals"],
          painPoints: ["Manual research time", "Low response rates", "Hard to reach decision-makers"],
          competitiveInsights: ["Competitors using AI outreach", "Signal-based selling trending", "Buyers filtering generic messages"],
          relevance: "Strong fit for your solution."
        },
        stealthScript: {
          opener: `${targetPersona?.split(' ').pop() || 'Hey'}, this is [Your Name] from ${yourCompany}. I noticed ${prospectCompany} is scaling the revenue team.`,
          bridge: `I was just speaking with a ${targetPersona} at a similar company who said getting reps to sell more and research less was their biggest challenge.`,
          valueHook: `We help teams generate 2-3x more qualified meetings in 30 days.`,
          closeQuestion: `Is that on your radar, or am I off base?`,
          fullScript: `${targetPersona?.split(' ').pop() || 'Hey'}, this is [Your Name] from ${yourCompany}. I noticed ${prospectCompany} is scaling fast. I was just speaking with a similar ${targetPersona} who mentioned the research bottleneck. We help teams get 2-3x more meetings in 30 days. Is that on your radar?`
        },
        linkedinMessage: `Saw ${prospectCompany}'s growth—curious how you're thinking about outbound efficiency?`,
        email: {
          subject: `${prospectCompany}'s outbound`,
          body: `Hey,\n\nNoticed hiring on the revenue side—pipeline pressure must be real.\n\nAt ${yourCompany}, we help teams like yours get 2-3x more qualified meetings in 30 days.\n\nWorth a quick look?`
        },
        isDemo: true
      }
    });
  }
}
