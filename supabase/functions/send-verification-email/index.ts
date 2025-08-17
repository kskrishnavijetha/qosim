
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token, redirectUrl }: VerificationEmailRequest = await req.json();
    
    const verificationUrl = `${redirectUrl}?message=Please sign in with your verified email address`;

    const emailResponse = await resend.emails.send({
      from: "Quantum OS Support <support@qosim.app>",
      to: [email],
      subject: "Verify your Quantum OS account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
              margin: 0;
              padding: 40px 20px;
              color: #ffffff;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: rgba(26, 26, 46, 0.8);
              border: 1px solid #00ffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            }
            .header {
              background: linear-gradient(90deg, #00ffff 0%, #0080ff 100%);
              padding: 30px 40px;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #000;
              margin-bottom: 10px;
            }
            .subtitle {
              color: rgba(0, 0, 0, 0.8);
              font-size: 14px;
            }
            .content {
              padding: 40px;
              text-align: center;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 20px;
              background: linear-gradient(45deg, #00ffff, #0080ff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .description {
              font-size: 16px;
              line-height: 1.6;
              color: #cccccc;
              margin-bottom: 30px;
            }
            .verify-button {
              display: inline-block;
              background: linear-gradient(45deg, #00ffff, #0080ff);
              color: #000;
              text-decoration: none;
              padding: 15px 30px;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              transition: transform 0.2s;
            }
            .verify-button:hover {
              transform: translateY(-2px);
            }
            .footer {
              padding: 30px 40px;
              border-top: 1px solid rgba(0, 255, 255, 0.3);
              text-align: center;
              font-size: 14px;
              color: #888;
            }
            .quantum-accent {
              color: #00ffff;
              font-weight: bold;
            }
            .instructions {
              background: rgba(0, 255, 255, 0.1);
              border: 1px solid rgba(0, 255, 255, 0.3);
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: left;
            }
            .step {
              margin: 10px 0;
              padding-left: 20px;
              position: relative;
            }
            .step::before {
              content: "→";
              position: absolute;
              left: 0;
              color: #00ffff;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚛️ Quantum OS</div>
              <div class="subtitle">Enter the quantum realm</div>
            </div>
            
            <div class="content">
              <h1 class="title">Email Verified Successfully!</h1>
              <p class="description">
                Congratulations! Your email address has been verified. You can now access all features of our quantum computing platform.
              </p>
              
              <div class="instructions">
                <h3 style="color: #00ffff; margin-top: 0;">Next Steps:</h3>
                <div class="step">Click the button below to return to the sign-in page</div>
                <div class="step">Sign in with your verified email and password</div>
                <div class="step">Start building quantum circuits and exploring our tools</div>
              </div>
              
              <a href="${verificationUrl}" class="verify-button">
                Continue to Sign In
              </a>
              
              <p class="description">
                You now have access to our advanced quantum circuit builder, simulation tools, and the complete <span class="quantum-accent">Quantum SDK</span>.
              </p>
            </div>
            
            <div class="footer">
              <p>Welcome to the quantum computing revolution!</p>
              <p>© 2024 Quantum OS - Quantum Computing Made Accessible</p>
              <p>Need help? Contact us at <a href="mailto:support@qosim.app" style="color: #00ffff;">support@qosim.app</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
