export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const { action, payload } = body || {};
    
    const GAS_URL = process.env.GAS_WEB_APP_URL;
    const API_TOKEN = process.env.GAS_API_TOKEN;

    if (!GAS_URL) {
      return res.status(200).json({ 
        success: false, 
        message: 'DEBUG ERROR: GAS_WEB_APP_URL di Vercel belum dikonfigurasi.' 
      });
    }

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      body: JSON.stringify({
        token: API_TOKEN,
        action: action,
        payload: payload
      })
    });

    const textResult = await response.text();
    const trimmedResult = textResult.trim();
    
    // 1. Deteksi jika balasan berupa HTML (Halaman Error / Login Google)
    if (trimmedResult.startsWith('<') || trimmedResult.toLowerCase().includes('<!doctype html>')) {
      return res.status(200).json({ 
        success: false, 
        message: 'Google Apps Script mengembalikan halaman HTML/Error. Pastikan Deployment Web App di GAS sudah di-set ke "Anyone".' 
      });
    }

    // 2. Parse JSON dengan aman
    try {
      const jsonResult = JSON.parse(trimmedResult);
      return res.status(200).json(jsonResult);
    } catch (parseError) {
      return res.status(200).json({ 
        success: false, 
        message: 'Format respon dari server tidak valid (Gagal parsing JSON).' 
      });
    }

  } catch (error) {
    return res.status(200).json({ 
      success: false, 
      message: "Proxy Catch Error: " + error.message 
    });
  }
}
