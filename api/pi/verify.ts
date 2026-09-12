// Serverless route for Vercel deployment compatibility
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { accessToken } = req.body || {};

    if (!accessToken || typeof accessToken !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid accessToken in request body',
      });
    }

    const piResponse = await fetch('https://api.minepi.com/v2/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!piResponse.ok) {
      const errorText = await piResponse.text();
      return res.status(piResponse.status).json({
        error: 'Pi Network token verification failed',
        status: piResponse.status,
        details: errorText,
      });
    }

    const piUser = await piResponse.json();
    return res.status(200).json({
      success: true,
      user: piUser,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal server error during Pi Network verification',
      message: err?.message || 'Unknown error',
    });
  }
}
