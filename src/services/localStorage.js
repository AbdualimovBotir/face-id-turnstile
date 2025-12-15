const KEYS = { USERS: 'faceIdUsers', TELEGRAM: 'telegramConfig' };

export const loadUsers = () => {
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
};
export const saveUsers = (users) => localStorage.setItem(KEYS.USERS, JSON.stringify(users));

export const loadTelegramConfig = () => {
  const data = localStorage.getItem(KEYS.TELEGRAM);
  return data ? JSON.parse(data) : { botToken: '', chatId: '' };
};
export const saveTelegramConfig = (config) => localStorage.setItem(KEYS.TELEGRAM, JSON.stringify(config));
