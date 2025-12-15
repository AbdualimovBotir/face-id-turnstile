import React from 'react';
import { Trash2 } from 'lucide-react';

export default function UserList({ users, onDelete }) {
  const handleDelete = (userId, userName) => {
    if (window.confirm(`${userName} ni o'chirmoqchimisiz?`)) {
      onDelete(userId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Foydalanuvchilar ro'yxati</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Hozircha foydalanuvchilar yo'q.</p>
          <p className="text-gray-500 text-sm mt-2">Yangi foydalanuvchi qo'shing.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rasm</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">F.I.O</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Telefon</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pasport</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Yo'nalish</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Guruh</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sana</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <img 
                      src={user.yuzRasmiBase64} 
                      alt={user.ism}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-800">
                      {user.familiya} {user.ism}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.otaIsmi}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.telRaqam}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.pasportRaqam}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {user.yonalish}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {user.guruhRaqami}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {user.qoshilganSana}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(user.id, `${user.familiya} ${user.ism}`)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition"
                      title="O'chirish"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}