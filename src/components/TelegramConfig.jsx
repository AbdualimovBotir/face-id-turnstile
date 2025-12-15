import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

export default function TelegramConfig({ config, onSave, onClose }) {
  const [formData, setFormData] = useState(config);

  const handleSave = () => {
    if (!formData.botToken || !formData.chatId) {
      alert('Bot Token va Chat ID ni kiriting!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Telegram Sozlamalari</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bot Token *
            </label>
            <input
              type="text"
              value={formData.botToken}
              onChange={(e) => setFormData({...formData, botToken: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="1234567890:ABCdefGHI..."
            />
            <p className="text-xs text-gray-500 mt-1">
              @BotFather dan olingan token
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chat ID *
            </label>
            <input
              type="text"
              value={formData.chatId}
              onChange={(e) => setFormData({...formData, chatId: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="-1001234567890"
            />
            <p className="text-xs text-gray-500 mt-1">
              @userinfobot dan olingan ID
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-blue-800 mb-2">📌 Qo'llanma:</h4>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. @BotFather ga /newbot yuboring</li>
              <li>2. Bot Token ni nusxa oling</li>
              <li>3. @userinfobot ga /start yuboring</li>
              <li>4. Chat ID ni nusxa oling</li>
            </ol>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}