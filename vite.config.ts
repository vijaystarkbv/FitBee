import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const VERIFIED_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
];

/**
 * Local development middleware for Vite to emulate Cloudflare Worker /api/gemini endpoint
 * Uses server-side GEMINI_API_KEY without exposing it to the client bundle.
 */
function geminiDevPlugin(apiKey: string): Plugin {
  return {
    name: 'dev-gemini-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? new URL(req.url, 'http://localhost') : null;
        if (url && (url.pathname === '/api/gemini' || url.pathname === '/api/gemini/')) {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          if (!apiKey || apiKey.trim() === '' || apiKey.includes('placeholder')) {
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Gemini service is not configured on the server.' }));
            return;
          }

          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
              const responseMimeType = typeof body?.responseMimeType === 'string' ? body.responseMimeType : 'application/json';

              if (!prompt) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Prompt is required.' }));
                return;
              }

              let lastError: Error | null = null;
              let foundText: string | null = null;

              for (const modelName of VERIFIED_MODELS) {
                try {
                  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
                  const apiRes = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{ parts: [{ text: prompt }] }],
                      generationConfig: { responseMimeType },
                    }),
                  });

                  if (!apiRes.ok) {
                    lastError = new Error(`Model ${modelName} returned HTTP ${apiRes.status}`);
                    continue;
                  }

                  const data: any = await apiRes.json();
                  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    foundText = text;
                    break;
                  }
                } catch (err) {
                  lastError = err instanceof Error ? err : new Error(String(err));
                  continue;
                }
              }

              if (foundText) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ text: foundText }));
              } else {
                throw lastError || new Error('All models failed');
              }
            } catch (err: any) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to generate response from AI service.' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  return {
    plugins: [react(), geminiDevPlugin(apiKey)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
