import React from 'react';
import { Trash2 } from 'lucide-react';

export default function UserList({ users, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow-lg">
      {users.length === 0 ? <p>Hozircha foydalanuvchilar yo‘q</p> :
        <table className="w-full">
          <thead>
            <tr>
              <th>Rasm</th><th>F.I.O</th><th>Telefon</th><th>Pasport</th><th>Yo'nalish</th><th>Guruh</th><th>Sana</th><th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><img src={u.yuzRasmiBase64} alt={u.ism} className="w-12 h-12 rounded-full"/></td>
                <td>{u.familiya} {u.ism} ({u.otaIsmi})</td>
                <td>{u.telRaqam}</td>
                <td>{u.pasportRaqam}</td>
                <td>{u.yonalish}</td>
                <td>{u.guruhRaqami}</td>
                <td>{u.qoshilganSana}</td>
                <td><button onClick={()=>onDelete(u.id)} className="text-red-600"><Trash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}
