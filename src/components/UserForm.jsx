import React, { useState } from 'react';
import { Send } from 'lucide-react';
import CameraCapture from './CameraCapture';
import { sendToTelegram } from '../services/telegram';
import { validateForm } from '../utils/validators';

export default function UserForm({ telegramConfig, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    ism: '',
    familiya: '',
    otaIsmi: '',
    telRaqam: '',
    pasportRaqam: '',
    yonalish: '',
    guruhRaqami: '',
    yuzRasmiBase64: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError('');
    setIsSending(true);

    const newUser = {
      id: Date.now().toString(),
      ...formData,
      qoshilganSana: new Date().toLocaleString('uz-UZ')
    };

    try {
      // Send to Telegram
      const telegramSuccess = await sendToTelegram(
        telegramConfig.botToken,
        telegramConfig.chatId,
        newUser
      );

      if (telegramSuccess) {
        onSave(newUser);
        alert('Foydalanuvchi muvaffaqiyatli qo\'shildi va Telegramga yuborildi!');
      } else {
        setError('Telegramga yuborishda xatolik yuz berdi');
      }
    } catch (error) {
      setError('Xatolik: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Yangi foydalanuvchi qo'shish</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ism *</label>
            <input
              type="text"
              value={formData.ism}
              onChange={(e) => setFormData({...formData, ism: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Masalan: Ali"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Familiya *</label>
            <input
              type="text"
              value={formData.familiya}
              onChange={(e) => setFormData({...formData, familiya: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Masalan: Valiyev"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Otasining ismi *</label>
            <input
              type="text"
              value={formData.otaIsmi}
              onChange={(e) => setFormData({...formData, otaIsmi: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Masalan: Karimovich"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon raqam *</label>
            <input
              type="tel"
              value={formData.telRaqam}
              onChange={(e) => setFormData({...formData, telRaqam: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="+998901234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pasport raqam *</label>
            <input
              type="text"
              value={formData.pasportRaqam}
              onChange={(e) => setFormData({...formData, pasportRaqam: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="AA1234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yo'nalish *</label>
            <input
              type="text"
              value={formData.yonalish}
              onChange={(e) => setFormData({...formData, yonalish: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Masalan: IT"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Guruh raqami *</label>
            <input
              type="text"
              value={formData.guruhRaqami}
              onChange={(e) => setFormData({...formData, guruhRaqami: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Masalan: G-101"
            />
          </div>
        </div>

        {/* Camera Component */}
        <CameraCapture
          onCapture={(base64) => setFormData({...formData, yuzRasmiBase64: base64})}
          currentImage={formData.yuzRasmiBase64}
        />

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              <>
                <Send size={18} />
                Saqlash va Telegramga yuborish
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
}