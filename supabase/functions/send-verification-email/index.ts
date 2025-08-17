
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  token: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token, redirectUrl }: VerificationEmailRequest = await req.json();

    // Validate inputs
    if (!email || !token || !redirectUrl) {
      throw new Error('Missing required parameters');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Sanitize redirect URL to prevent open redirects
    const allowedDomains = [
      'localhost',
      '127.0.0.1',
      Deno.env.get('ALLOWED_DOMAIN') || 'qosim.lovableproject.com'
    ];
    
    const url = new URL(redirectUrl);
    const isAllowedDomain = allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
    
    if (!isAllowedDomain) {
      throw new Error('Invalid redirect URL');
    }

    const emailResponse = await resend.emails.send({
      from: "QOSim <noreply@resend.dev>",
      to: [email],
      subject: "Verify your QOSim account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to QOSim!</h1>
            </div>
            <div class="content">
              <h2>Verify your email address</h2>
              <p>Thank you for signing up for QOSim, the advanced quantum computing simulation platform!</p>
              <p>Please click the button below to verify your email address and activate your account:</p>
              <p style="text-align: center;">
                <a href="${redirectUrl}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e9e9e9; padding: 10px; border-radius: 4px;">
                ${redirectUrl}
              </p>
              <p><strong>This verification link expires in 24 hours.</strong></p>
              <p>If you didn't create an account with QOSim, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 QOSim - Quantum Computing Simulation Platform</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
