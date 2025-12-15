import React, { useState, useEffect } from 'react';
import { UserPlus, Download, Users, Camera, Send } from 'lucide-react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import TelegramConfig from './components/TelegramConfig';

function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTelegramConfig, setShowTelegramConfig] = useState(false);
  const [telegramConfig, setTelegramConfig] = useState({
    botToken: '8530376812:AAGuIUDAi1YOBzXgaMl4SqVmyPEBXFdczYo',
    chatId: ''
  });

  useEffect(() => {
    loadUsers();
    loadTelegramConfig();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('faceIdUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  };

  const loadTelegramConfig = () => {
    const savedConfig = localStorage.getItem('telegramConfig');
    if (savedConfig) {
      setTelegramConfig(JSON.parse(savedConfig));
    }
  };

  const saveUser = (user) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('faceIdUsers', JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('faceIdUsers', JSON.stringify(updatedUsers));
  };

  const exportToExcel = () => {
    if (users.length === 0) {
      alert('Eksport qilish uchun foydalanuvchilar yo\'q!');
      return;
    }

    let csv = 'Ism,Familiya,Otasining ismi,Telefon raqam,Pasport raqam,Yo\'nalish,Guruh raqami,Qo\'shilgan sana\n';
    
    users.forEach(user => {
      csv += `"${user.ism}","${user.familiya}","${user.otaIsmi}","${user.telRaqam}","${user.pasportRaqam}","${user.yonalish}","${user.guruhRaqami}","${user.qoshilganSana}"\n`;
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `foydalanuvchilar_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Camera className="text-indigo-600" size={32} />
                Face ID Turniket Tizimi
              </h1>
              <p className="text-gray-600 mt-1">SmartPCC uchun foydalanuvchilarni boshqarish</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowTelegramConfig(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition text-sm"
              >
                <Send size={18} />
                Telegram
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
              >
                <UserPlus size={20} />
                Yangi
              </button>
              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
              >
                <Download size={20} />
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Statistika */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-indigo-600" size={24} />
            <div>
              <p className="text-gray-600">Jami foydalanuvchilar</p>
              <p className="text-3xl font-bold text-gray-800">{users.length}</p>
            </div>
          </div>
        </div>

        {/* Telegram Config Modal */}
        {showTelegramConfig && (
          <TelegramConfig
            config={telegramConfig}
            onSave={(config) => {
              setTelegramConfig(config);
              localStorage.setItem('telegramConfig', JSON.stringify(config));
              setShowTelegramConfig(false);
            }}
            onClose={() => setShowTelegramConfig(false)}
          />
        )}

        {/* Form */}
        {showForm && (
          <UserForm
            telegramConfig={telegramConfig}
            onSave={(user) => {
              saveUser(user);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Users List */}
        <UserList users={users} onDelete={deleteUser} />
      </div>
    </div>
  );
}

export default App;