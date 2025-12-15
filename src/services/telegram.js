export const sendToTelegram = async (botToken, chatId, user) => {
  if (!botToken || !chatId) throw new Error('Bot Token yoki Chat ID kiritilmagan');

  const caption = `🆕 Yangi foydalanuvchi
👤 ${user.familiya} ${user.ism} ${user.otaIsmi}
📱 ${user.telRaqam}
🆔 ${user.pasportRaqam}
📚 ${user.yonalish}
👥 ${user.guruhRaqami}
📅 ${user.qoshilganSana}`;

  const base64Data = user.yuzRasmiBase64.split(',')[1];
  const byteArray = new Uint8Array([...atob(base64Data)].map(c => c.charCodeAt(0)));
  const blob = new Blob([byteArray], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', blob, 'photo.jpg');
  formData.append('caption', caption);

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: formData });
  const result = await res.json();
  if (!result.ok) throw new Error(result.description || 'Telegram xatosi');
  return true;
};
