// Telegram service functions

export const sendToTelegram = async (botToken, chatId, userData) => {
  if (!botToken || !chatId) {
    throw new Error('Bot Token yoki Chat ID kiritilmagan');
  }

  try {
    // Prepare caption
    const caption = `🆕 Yangi foydalanuvchi qo'shildi

👤 F.I.O: ${userData.familiya} ${userData.ism} ${userData.otaIsmi}
📱 Telefon: ${userData.telRaqam}
🆔 Pasport: ${userData.pasportRaqam}
📚 Yo'nalish: ${userData.yonalish}
👥 Guruh: ${userData.guruhRaqami}
📅 Qo'shilgan: ${userData.qoshilganSana}`;

    // Convert base64 to blob
    const base64Data = userData.yuzRasmiBase64.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Create form data
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'photo.jpg');
    formData.append('caption', caption);

    // Send to Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendPhoto`,
      {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();

    if (result.ok) {
      return true;
    } else {
      throw new Error(result.description || 'Telegram xatosi');
    }
  } catch (error) {
    console.error('Telegram error:', error);
    throw error;
  }
};

export const testTelegramConnection = async (botToken, chatId) => {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: '✅ Telegram bot muvaffaqiyatli ulandi!'
        })
      }
    );

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Test connection error:', error);
    return false;
  }
};