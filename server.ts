import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads
  app.use(express.json());

  // Requirement 8: Backend must verify the token by calling:
  // GET https://api.minepi.com/v2/me
  // with:
  // Authorization: Bearer <accessToken>
  // Requirement 9: Do not use or request a Pi Network API key for this /v2/me verification flow.
  app.post('/api/pi/verify', async (req, res) => {
    try {
      const { accessToken } = req.body;

      if (!accessToken || typeof accessToken !== 'string') {
        return res.status(400).json({
          error: 'Missing or invalid accessToken in request body',
        });
      }

      console.log('[Pi Backend] Verifying Pi token against https://api.minepi.com/v2/me ...');

      const piResponse = await fetch('https://api.minepi.com/v2/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!piResponse.ok) {
        const errorText = await piResponse.text();
        console.warn(`[Pi Backend] Verification failed (${piResponse.status}):`, errorText);
        return res.status(piResponse.status).json({
          error: 'Pi Network token verification failed',
          status: piResponse.status,
          details: errorText,
        });
      }

      const piUser = await piResponse.json();
      console.log('[Pi Backend] Token verified for Pi user:', piUser?.username || piUser?.uid);

      return res.json({
        success: true,
        user: piUser,
      });
    } catch (err: any) {
      console.error('[Pi Backend] Verification exception:', err);
      return res.status(500).json({
        error: 'Internal server error during Pi Network verification',
        message: err?.message || 'Unknown error',
      });
    }
  });

  // Health and API check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Press Express Assam Server',
      piAuthEndpoint: '/api/pi/verify',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
