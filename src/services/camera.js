// Camera service functions

export const startCamera = async () => {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Brauzeringiz kamerani qo\'llab-quvvatlamaydi. HTTPS orqali kirish talab qilinadi.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });
    return stream;
  } catch (error) {
    console.error('Camera error:', error);
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      throw new Error('Kamera ruxsati berilmadi. Brauzer sozlamalarida kamera ruxsatini yoqing.');
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      throw new Error('Kamera topilmadi. Kamera ulangan va ishlatyotganini tekshiring.');
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      throw new Error('Kamera band. Boshqa dasturlar kamerani ishlatmayotganini tekshiring.');
    } else if (error.name === 'OverconstrainedError') {
      throw new Error('Kamera talablarga javob bermaydi.');
    } else if (error.message && error.message.includes('https')) {
      throw new Error('Kamera faqat HTTPS orqali ishlaydi. https://localhost ishlatilishi kerak.');
    } else {
      throw new Error('Kamera ishga tushmadi: ' + error.message);
    }
  }
};

export const stopCamera = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

export const capturePhoto = (videoElement, canvasElement) => {
  if (!videoElement || !canvasElement) {
    throw new Error('Video yoki canvas elementi topilmadi');
  }

  const canvas = canvasElement;
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0);
  
  // Convert to base64 with quality compression
  const base64Image = canvas.toDataURL('image/jpeg', 0.7);
  return base64Image;
};

export const compressImage = async (base64Image, maxSizeKB = 120) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions if image is too large
      const maxDimension = 800;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels to meet size requirement
      let quality = 0.7;
      let result = canvas.toDataURL('image/jpeg', quality);
      
      while (result.length > maxSizeKB * 1024 * 4/3 && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(result);
    };
    
    img.onerror = () => reject(new Error('Rasmni yuklashda xatolik'));
    img.src = base64Image;
  });
};