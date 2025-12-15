export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { botToken, chatId, userData, imageBase64 } = req.body;

    if (!botToken || !chatId || !userData || !imageBase64) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert base64 to buffer
    const base64Data = imageBase64.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Create caption
    const caption = `🆕 Yangi foydalanuvchi qo'shildi

👤 F.I.O: ${userData.familiya} ${userData.ism} ${userData.otaIsmi}
📱 Telefon: ${userData.telRaqam}
🆔 Pasport: ${userData.pasportRaqam}
📚 Yo'nalish: ${userData.yonalish}
👥 Guruh: ${userData.guruhRaqami}
📅 Qo'shilgan: ${userData.qoshilganSana}`;

    // Send to Telegram
    const FormData = require('form-data');
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('photo', imageBuffer, { filename: 'photo.jpg' });
    form.append('caption', caption);

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendPhoto`,
      {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      }
    );

    const result = await response.json();

    if (result.ok) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(400).json({ error: result.description });
    }
  } catch (error) {
    console.error('Telegram API error:', error);
    return res.status(500).json({ error: error.message });
  }
}