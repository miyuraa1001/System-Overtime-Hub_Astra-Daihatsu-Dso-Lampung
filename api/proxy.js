export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { action, payload } = req.body;
    
    const GAS_URL = process.env.GAS_WEB_APP_URL;
    const API_TOKEN = process.env.GAS_API_TOKEN;

    if (!GAS_URL) {
      return res.status(200).json({ success: false, message: 'DEBUG ERROR: GAS_WEB_APP_URL di Vercel kosong/belum terbaca.' });
    }

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        token: API_TOKEN,
        action: action,
        payload: payload
      })
    });

    const textResult = await response.text();
    
    try {
      const jsonResult = JSON.parse(textResult);
      return res.status(200).json(jsonResult);
    } catch (e) {
      // Kirim teks asli dari Google supaya kelihatan error-nya di frontend/toast
      return res.status(200).json({ 
        success: false, 
        message: "GAS Response Error: " + textResult.substring(0, 150) 
      });
    }

  } catch (error) {
    return res.status(200).json({ success: false, message: "Proxy Catch Error: " + error.message });
  }
}
