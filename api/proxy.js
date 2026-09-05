export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const GAS_URL = process.env.GAS_WEB_APP_URL;
    const API_TOKEN = process.env.GAS_API_TOKEN;

    if (!GAS_URL) {
        return res.status(500).json({ success: false, message: 'Server Error: GAS_WEB_APP_URL belum diset di Vercel Environment Variables.' });
    }

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                token: API_TOKEN,
                action: req.body.action,
                payload: req.body.payload
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Proxy Exception: ' + error.message });
    }
}
