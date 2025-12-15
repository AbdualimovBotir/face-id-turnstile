// Local storage service functions

const STORAGE_KEYS = {
  USERS: 'faceIdUsers',
  TELEGRAM_CONFIG: 'telegramConfig'
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

export const loadUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

export const addUser = (user) => {
  const users = loadUsers();
  users.push(user);
  return saveUsers(users);
};

export const deleteUser = (userId) => {
  const users = loadUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  return saveUsers(filteredUsers);
};

export const saveTelegramConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving telegram config:', error);
    return false;
  }
};

export const loadTelegramConfig = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TELEGRAM_CONFIG);
    return data ? JSON.parse(data) : { botToken: '', chatId: '' };
  } catch (error) {
    console.error('Error loading telegram config:', error);
    return { botToken: '', chatId: '' };
  }
};

export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TELEGRAM_CONFIG);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};