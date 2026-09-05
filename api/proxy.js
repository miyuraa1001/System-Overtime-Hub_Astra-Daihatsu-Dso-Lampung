export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { action, payload } = req.body;
    
    const GAS_URL = process.env.GAS_WEB_APP_URL;
    const API_TOKEN = process.env.GAS_API_TOKEN;

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        token: API_TOKEN,
        action: action,
        payload: payload
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
