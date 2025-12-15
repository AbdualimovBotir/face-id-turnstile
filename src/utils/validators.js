// Validation utility functions

export const validateForm = (formData) => {
  // Check required fields
  if (!formData.ism || !formData.ism.trim()) {
    return { isValid: false, error: 'Ism kiritilmagan' };
  }
  
  if (!formData.familiya || !formData.familiya.trim()) {
    return { isValid: false, error: 'Familiya kiritilmagan' };
  }
  
  if (!formData.otaIsmi || !formData.otaIsmi.trim()) {
    return { isValid: false, error: 'Otasining ismi kiritilmagan' };
  }
  
  if (!formData.telRaqam || !formData.telRaqam.trim()) {
    return { isValid: false, error: 'Telefon raqam kiritilmagan' };
  }
  
  if (!formData.pasportRaqam || !formData.pasportRaqam.trim()) {
    return { isValid: false, error: 'Pasport raqam kiritilmagan' };
  }
  
  if (!formData.yonalish || !formData.yonalish.trim()) {
    return { isValid: false, error: 'Yo\'nalish kiritilmagan' };
  }
  
  if (!formData.guruhRaqami || !formData.guruhRaqami.trim()) {
    return { isValid: false, error: 'Guruh raqami kiritilmagan' };
  }
  
  if (!formData.yuzRasmiBase64) {
    return { isValid: false, error: 'Yuz rasmi yuklanmagan' };
  }

  // Validate phone number format (Uzbekistan format)
  const phoneRegex = /^\+998[0-9]{9}$/;
  if (!phoneRegex.test(formData.telRaqam.replace(/\s/g, ''))) {
    return { 
      isValid: false, 
      error: 'Telefon raqam noto\'g\'ri formatda. Misol: +998901234567' 
    };
  }

  // Validate passport number (Uzbekistan format: AA1234567)
  const passportRegex = /^[A-Z]{2}[0-9]{7}$/;
  if (!passportRegex.test(formData.pasportRaqam.replace(/\s/g, ''))) {
    return { 
      isValid: false, 
      error: 'Pasport raqam noto\'g\'ri formatda. Misol: AA1234567' 
    };
  }

  return { isValid: true, error: null };
};

export const validateTelegramConfig = (config) => {
  if (!config.botToken || !config.botToken.trim()) {
    return { isValid: false, error: 'Bot Token kiritilmagan' };
  }

  if (!config.chatId || !config.chatId.trim()) {
    return { isValid: false, error: 'Chat ID kiritilmagan' };
  }

  // Validate bot token format
  const tokenRegex = /^[0-9]{8,10}:[A-Za-z0-9_-]{35}$/;
  if (!tokenRegex.test(config.botToken)) {
    return { 
      isValid: false, 
      error: 'Bot Token formati noto\'g\'ri' 
    };
  }

  return { isValid: true, error: null };
};

export const validateImageSize = (base64Image, maxSizeKB = 120) => {
  const sizeInBytes = (base64Image.length * 3) / 4;
  const sizeInKB = sizeInBytes / 1024;
  
  if (sizeInKB > maxSizeKB) {
    return {
      isValid: false,
      error: `Rasm hajmi ${Math.round(sizeInKB)}KB. ${maxSizeKB}KB dan oshmasligi kerak.`,
      actualSize: Math.round(sizeInKB)
    };
  }

  return { isValid: true, error: null, actualSize: Math.round(sizeInKB) };
};