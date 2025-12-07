// Resend integration for sending transactional emails
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
export async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: credentials.fromEmail
  };
}

// Send Pipeline Activation Pack email
export async function sendPipelinePackEmail(
  toEmail: string, 
  packContent: {
    yourCompany: string;
    yourProduct: string;
    targetPersona: string;
    prospectCompany: string;
    research: {
      companyOverview: string;
      keyTriggers: string[];
      painPoints: string[];
      competitiveInsights?: string[];
    };
    email: {
      subject: string;
      body: string;
    };
    linkedinMessage: string;
    stealthScript?: {
      fullScript: string;
    };
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Pipeline Activation Pack</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="color: #FF8C00; font-size: 28px; margin: 0; font-weight: 700;">SYMMETRI GROWTH LABS</h1>
              <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 10px 0 0 0;">Pipeline Activation Pack</p>
            </td>
          </tr>
          
          <!-- Intro -->
          <tr>
            <td style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 20px;">
              <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0;">
                Your STEALTH™ Certified outreach assets are ready. These have been specifically crafted for reaching <strong style="color: #FF8C00;">${packContent.targetPersona}</strong> at <strong style="color: #FF8C00;">${packContent.prospectCompany}</strong>.
              </p>
            </td>
          </tr>
          
          <tr><td style="height: 20px;"></td></tr>
          
          <!-- Research Intel -->
          <tr>
            <td style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px;">
              <h2 style="color: #FF8C00; font-size: 18px; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">📊 GEMINI RESEARCH INTELLIGENCE</h2>
              
              <p style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                ${packContent.research.companyOverview}
              </p>
              
              <h3 style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">Buying Signals:</h3>
              <ul style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                ${packContent.research.keyTriggers.map(t => `<li>${t}</li>`).join('')}
              </ul>
              
              <h3 style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">Pain Points:</h3>
              <ul style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                ${packContent.research.painPoints.map(p => `<li>${p}</li>`).join('')}
              </ul>
              
              ${packContent.research.competitiveInsights ? `
              <h3 style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">Competitive Insights:</h3>
              <ul style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                ${packContent.research.competitiveInsights.map(c => `<li>${c}</li>`).join('')}
              </ul>
              ` : ''}
            </td>
          </tr>
          
          <tr><td style="height: 20px;"></td></tr>
          
          <!-- Email Template -->
          <tr>
            <td style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px;">
              <h2 style="color: #FF8C00; font-size: 18px; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">✉️ STEALTH™ EMAIL</h2>
              
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;"><strong>Subject:</strong> ${packContent.email.subject}</p>
              
              <div style="background-color: #050505; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-top: 15px;">
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${packContent.email.body}</p>
              </div>
            </td>
          </tr>
          
          <tr><td style="height: 20px;"></td></tr>
          
          <!-- LinkedIn Message -->
          <tr>
            <td style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px;">
              <h2 style="color: #FF8C00; font-size: 18px; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">💼 LINKEDIN MESSAGE</h2>
              
              <div style="background-color: #050505; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 20px;">
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.7; margin: 0;">${packContent.linkedinMessage}</p>
              </div>
            </td>
          </tr>
          
          <tr><td style="height: 20px;"></td></tr>
          
          <!-- Cold Call Script -->
          ${packContent.stealthScript?.fullScript ? `
          <tr>
            <td style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px;">
              <h2 style="color: #FF8C00; font-size: 18px; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">📞 STEALTH™ COLD CALL SCRIPT</h2>
              
              <div style="background-color: #050505; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 20px;">
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${packContent.stealthScript.fullScript}</p>
              </div>
            </td>
          </tr>
          
          <tr><td style="height: 20px;"></td></tr>
          ` : ''}
          
          <!-- STEALTH Methodology -->
          <tr>
            <td style="background-color: #0a0a0a; border: 1px solid rgba(255,138,26,0.2); border-radius: 12px; padding: 30px;">
              <h2 style="color: #FF8C00; font-size: 18px; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">🛡️ STEALTH™ METHODOLOGY</h2>
              
              <table cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #FF8C00; font-weight: bold; width: 30px;">S</td>
                  <td style="padding: 8px 0; color: rgba(255,255,255,0.7);">Strategic Call Pattern Management</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #FF8C00; font-weight: bold;">T</td>
                  <td style="padding: 8px 0; color: rgba(255,255,255,0.7);">Tonality Optimization for AI Scoring</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #FF8C00; font-weight: bold;">E</td>
                  <td style="padding: 8px 0; color: rgba(255,255,255,0.7);">Eliminate Spam Trigger Language</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #FF8C00; font-weight: bold;">A</td>
                  <td style="padding: 8px 0; color: rgba(255,255,255,0.7);">Authentic Conversation Techniques</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #FF8C00; font-weight: bold;">L</td>
                  <td style="padding: 8px 0; color: rgba(255,255,255,0.7);">Language Reframing Mastery</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #FF8C00; font-weight: bold;">T</td>
                  <td style="padding: 8px 0; color: rgba(255,255,255,0.7);">Timing and Volume Control</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #FF8C00; font-weight: bold;">H</td>
                  <td style="padding: 8px 0; color: rgba(255,255,255,0.7);">Human-Like Delivery Training</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr><td style="height: 30px;"></td></tr>
          
          <!-- CTA -->
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="https://calendar.app.google/tXjMUnVvDC4i8vq57" style="display: inline-block; background: linear-gradient(135deg, #FF8C00, #E65C00); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Book Your Free GTM Diagnostic</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 30px 0; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
                Powered by Symmetri Growth Labs<br>
                Autonomous Revenue Engine
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `SYMMETRI GROWTH LABS - PIPELINE ACTIVATION PACK
==============================================
STEALTH™ Certified Outreach Assets

Generated for: ${packContent.yourCompany}
Target: ${packContent.targetPersona} at ${packContent.prospectCompany}
Product: ${packContent.yourProduct}

-------------------------------------------
GEMINI RESEARCH INTELLIGENCE
-------------------------------------------
${packContent.research.companyOverview}

Buying Signals:
${packContent.research.keyTriggers.map(t => `• ${t}`).join('\n')}

Pain Points:
${packContent.research.painPoints.map(p => `• ${p}`).join('\n')}

Competitive Insights:
${packContent.research.competitiveInsights?.map(c => `• ${c}`).join('\n') || 'N/A'}

-------------------------------------------
STEALTH™ EMAIL
-------------------------------------------
Subject: ${packContent.email.subject}

${packContent.email.body}

-------------------------------------------
LINKEDIN MESSAGE
-------------------------------------------
${packContent.linkedinMessage}

-------------------------------------------
STEALTH™ COLD CALL SCRIPT
-------------------------------------------
${packContent.stealthScript?.fullScript || ''}

-------------------------------------------
STEALTH™ METHODOLOGY
-------------------------------------------
S - Strategic Call Pattern Management
T - Tonality Optimization for AI Scoring
E - Eliminate Spam Trigger Language
A - Authentic Conversation Techniques
L - Language Reframing Mastery
T - Timing and Volume Control
H - Human-Like Delivery Training

-------------------------------------------
Book your free GTM Diagnostic: https://calendar.app.google/tXjMUnVvDC4i8vq57

Powered by Symmetri Growth Labs
https://symmetrigrowth.com
`;

    await client.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Your Pipeline Activation Pack for ${packContent.prospectCompany}`,
      html: htmlContent,
      text: textContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send Pipeline Pack email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
