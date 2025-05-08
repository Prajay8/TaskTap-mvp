import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const taskData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskData);
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Available Tasks</h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks posted yet.</p>
        )}
        {tasks.map(task => (
            <Link to={`/tasks/${task.id}`}>
            <div key={task.id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-blue-600">{task.title}</h3>
                <p className="text-gray-700">{task.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                📍 {task.location} | 💰 ${task.price} | 🕒 {task.datetime}
                </div>
            </div>
            </Link>
        ))}
      </div>
    </div>
  );
}
