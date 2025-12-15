import React, { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { loadUsers, saveUsers, loadTelegramConfig, saveTelegramConfig } from './services/localStorage';

export default function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [telegramConfig, setTelegramConfig] = useState({ botToken:'', chatId:'' });

  useEffect(()=>{
    setUsers(loadUsers());
    setTelegramConfig(loadTelegramConfig());
  }, []);

  const addUser = (user) => {
    const updated = [...users, user];
    setUsers(updated);
    saveUsers(updated);
  };

  const deleteUser = (id) => {
    const updated = users.filter(u=>u.id!==id);
    setUsers(updated);
    saveUsers(updated);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-4">
        <button onClick={()=>setShowForm(!showForm)} className="bg-indigo-600 text-white p-2 rounded">Yangi foydalanuvchi</button>
        {showForm && <UserForm telegramConfig={telegramConfig} onSave={(u)=>{addUser(u); setShowForm(false)}} onCancel={()=>setShowForm(false)} />}
        <UserList users={users} onDelete={deleteUser} />
      </div>
    </div>
  );
}
