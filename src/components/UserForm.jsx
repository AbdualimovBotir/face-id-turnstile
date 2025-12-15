import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import { sendToTelegram } from '../services/telegram';

export default function UserForm({ telegramConfig, onSave, onCancel }) {
  const [form, setForm] = useState({ ism:'', familiya:'', otaIsmi:'', telRaqam:'', pasportRaqam:'', yonalish:'', guruhRaqami:'', yuzRasmiBase64:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.ism || !form.familiya || !form.otaIsmi || !form.telRaqam || !form.pasportRaqam || !form.yonalish || !form.guruhRaqami || !form.yuzRasmiBase64) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) { setError('Barcha maydonlar to‘ldirilishi kerak'); return; }
    setError(''); setLoading(true);

    const newUser = { ...form, id: Date.now().toString(), qoshilganSana: new Date().toLocaleString('uz-UZ') };
    try {
      if (telegramConfig.botToken && telegramConfig.chatId) await sendToTelegram(telegramConfig.botToken, telegramConfig.chatId, newUser);
      onSave(newUser);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <input placeholder="Ism" value={form.ism} onChange={e=>setForm({...form, ism:e.target.value})} className="border p-1 w-full mb-2"/>
      <input placeholder="Familiya" value={form.familiya} onChange={e=>setForm({...form, familiya:e.target.value})} className="border p-1 w-full mb-2"/>
      <input placeholder="Otasining ismi" value={form.otaIsmi} onChange={e=>setForm({...form, otaIsmi:e.target.value})} className="border p-1 w-full mb-2"/>
      <input placeholder="Telefon" value={form.telRaqam} onChange={e=>setForm({...form, telRaqam:e.target.value})} className="border p-1 w-full mb-2"/>
      <input placeholder="Pasport" value={form.pasportRaqam} onChange={e=>setForm({...form, pasportRaqam:e.target.value})} className="border p-1 w-full mb-2"/>
      <input placeholder="Yo'nalish" value={form.yonalish} onChange={e=>setForm({...form, yonalish:e.target.value})} className="border p-1 w-full mb-2"/>
      <input placeholder="Guruh raqami" value={form.guruhRaqami} onChange={e=>setForm({...form, guruhRaqami:e.target.value})} className="border p-1 w-full mb-2"/>
      <CameraCapture currentImage={form.yuzRasmiBase64} onCapture={img=>setForm({...form, yuzRasmiBase64: img})} />
      <div className="flex gap-2 mt-2">
        <button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 text-white p-2 rounded flex-1">{loading?'Yuborilmoqda':'Saqlash'}</button>
        <button onClick={onCancel} className="bg-gray-300 p-2 rounded flex-1">Bekor</button>
      </div>
    </div>
  );
}
