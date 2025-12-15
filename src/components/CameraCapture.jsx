import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { startCamera, stopCamera, capturePhoto, compressImage } from '../services/camera';

export default function CameraCapture({ onCapture, currentImage }) {
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);

  const handleStartCamera = async () => {
    try {
      const stream = await startCamera();
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current.play();
      setShowCamera(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStopCamera = () => {
    stopCamera(streamRef.current);
    streamRef.current = null;
    setShowCamera(false);
  };

  const handleCapture = async () => {
    try {
      let img = capturePhoto(videoRef.current, canvasRef.current);
      img = await compressImage(img, 120);
      onCapture(img);
      handleStopCamera();
    } catch (err) { setError(err.message); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) { setError('Faqat rasm fayli'); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        let img = ev.target.result;
        img = await compressImage(img, 120);
        onCapture(img);
        setError('');
      } catch (err) { setError('Rasm yuklash xatosi'); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-2 border-dashed p-4 rounded-lg">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {!showCamera && !currentImage && (
        <>
          <button onClick={handleStartCamera} className="bg-indigo-600 text-white p-2 rounded flex items-center gap-2">
            <Camera /> Kamerani yoqish
          </button>
          <button onClick={() => fileRef.current.click()} className="bg-gray-200 p-2 rounded flex items-center gap-2 mt-2">
            <Upload /> Fayl yuklash
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </>
      )}
      {showCamera && (
        <div>
          <video ref={videoRef} className="w-full rounded mb-2" autoPlay playsInline />
          <div className="flex gap-2">
            <button onClick={handleCapture} className="bg-green-600 text-white p-2 rounded flex-1">📸 Olish</button>
            <button onClick={handleStopCamera} className="bg-red-600 text-white p-2 rounded flex-1">Bekor</button>
          </div>
        </div>
      )}
      {currentImage && <img src={currentImage} alt="Preview" className="w-40 h-40 object-cover rounded mt-2" />}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
