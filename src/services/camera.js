export const startCamera = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Brauzeringiz kamerani qo\'llab-quvvatlamaydi. HTTPS orqali kirish talab qilinadi.');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
    });
    return stream;
  } catch (err) {
    if (err.name === 'NotAllowedError') throw new Error('Kamera ruxsati berilmadi.');
    if (err.name === 'NotFoundError') throw new Error('Kamera topilmadi.');
    if (err.name === 'NotReadableError') throw new Error('Kamera band.');
    throw new Error('Kamera ishga tushmadi: ' + err.message);
  }
};

export const stopCamera = (stream) => {
  if (stream) stream.getTracks().forEach(track => track.stop());
};

export const capturePhoto = (video, canvas) => {
  if (!video || !canvas) throw new Error('Video yoki canvas topilmadi');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.7);
};

export const compressImage = async (base64, maxKB = 120) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width, height = img.height;
      const maxDim = 800;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = height / width * maxDim; width = maxDim; }
        else { width = width / height * maxDim; height = maxDim; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.7;
      let result = canvas.toDataURL('image/jpeg', quality);
      while (result.length > maxKB * 1024 * 4/3 && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(result);
    };
    img.onerror = () => reject(new Error('Rasmni yuklashda xatolik'));
    img.src = base64;
  });
};
