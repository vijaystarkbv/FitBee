export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  GEMINI_API_KEY?: string;
}

const VERIFIED_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
];

/**
 * Calls Gemini via Google Generative Language REST API using server-side secret
 */
async function callGemini(
  apiKey: string,
  prompt: string,
  responseMimeType: string = 'application/json'
): Promise<string> {
  let lastError: Error | null = null;

  for (const modelName of VERIFIED_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: responseMimeType || 'application/json',
          },
        }),
      });

      if (!response.ok) {
        // Do not leak apiKey or raw API error with sensitive query string
        lastError = new Error(`Gemini model ${modelName} returned HTTP ${response.status}`);
        continue;
      }

      const data: any = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
      lastError = new Error(`Gemini model ${modelName} returned empty candidate text`);
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      continue;
    }
  }

  throw lastError || new Error('All verified Gemini models failed to respond');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ── API Routes ──
    if (url.pathname === '/api/gemini' || url.pathname === '/api/gemini/') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '' || apiKey.includes('placeholder')) {
        return new Response(
          JSON.stringify({ error: 'Gemini service is not configured on the server.' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      try {
        const body: any = await request.json();
        const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
        const responseMimeType = typeof body?.responseMimeType === 'string' ? body.responseMimeType : 'application/json';

        if (!prompt) {
          return new Response(
            JSON.stringify({ error: 'Prompt is required.' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const text = await callGemini(apiKey, prompt, responseMimeType);
        return new Response(JSON.stringify({ text }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        // Log generic error on worker side without secrets
        console.error('FitBee Worker Gemini API error:', err?.message || 'Unknown error');
        return new Response(
          JSON.stringify({ error: 'Failed to generate response from AI service.' }),
          {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // ── Static Assets & SPA Routing fallback ──
    return env.ASSETS.fetch(request);
  },
};
