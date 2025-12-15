import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { startCamera, stopCamera, capturePhoto } from '../services/camera';

export default function CameraCapture({ onCapture, currentImage }) {
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleStartCamera = async () => {
    try {
      const stream = await startCamera();
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
      setError('');
    } catch (err) {
      setError('Kamera ishga tushmadi: ' + err.message);
    }
  };

  const handleStopCamera = () => {
    stopCamera(streamRef.current);
    streamRef.current = null;
    setShowCamera(false);
  };

  const handleCapture = () => {
    try {
      const base64Image = capturePhoto(videoRef.current, canvasRef.current);
      
      // Check image size (120KB = 122880 bytes)
      const sizeInBytes = (base64Image.length * 3) / 4;
      if (sizeInBytes > 122880) {
        setError('Rasm hajmi 120KB dan oshdi! Qaytadan suratga oling.');
        return;
      }
      
      onCapture(base64Image);
      handleStopCamera();
      setError('');
    } catch (err) {
      setError('Surat olishda xatolik: ' + err.message);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Yuz rasmi * (max 120KB)
      </label>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {!showCamera && !currentImage && (
        <button
          onClick={handleStartCamera}
          className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
        >
          <Camera size={24} />
          Kamerani yoqish
        </button>
      )}

      {showCamera && (
        <div className="space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg border-2 border-indigo-300"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCapture}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              📸 Suratga olish
            </button>
            <button
              onClick={handleStopCamera}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {currentImage && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-green-600">✓ Rasm yuklandi</p>
          <img 
            src={currentImage} 
            alt="Preview" 
            className="w-40 h-40 object-cover rounded-lg border-2 border-gray-300 mx-auto" 
          />
          <button
            onClick={() => {
              onCapture('');
              handleStartCamera();
            }}
            className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Qayta suratga olish
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{display: 'none'}} />
    </div>
  );
}