import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are CyberGuard AI, an elite cybersecurity assistant for the IWALA99 platform. You help users with:

- Cybersecurity concepts (networking, cryptography, web security, forensics, reverse engineering)
- CTF (Capture The Flag) challenge hints — guide users toward solutions without giving direct answers
- Security tools usage (nmap, Burp Suite, Wireshark, Metasploit, John the Ripper, etc.)
- Vulnerability analysis and secure coding practices
- Career guidance in cybersecurity

Rules:
- Never reveal CTF flags directly. Give progressive hints instead.
- Use technical but accessible language.
- When discussing exploits, always emphasize ethical and legal usage.
- Format responses with markdown for readability.
- Keep responses concise but thorough.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, provider = "lovable" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let apiUrl: string;
    let apiKey: string;
    let model: string;

    if (provider === "blackbox") {
      apiKey = Deno.env.get("BLACKBOX_AI_KEY") || "";
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "BlackBox AI key is not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      apiUrl = "https://api.blackbox.ai/chat/completions";
      model = "blackboxai";
    } else {
      apiKey = Deno.env.get("LOVABLE_API_KEY") || "";
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "Lovable AI key is not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      apiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
      model = "google/gemini-3-flash-preview";
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error(`AI gateway error [${provider}]:`, response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AI provider error (${response.status})` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("cyber-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
