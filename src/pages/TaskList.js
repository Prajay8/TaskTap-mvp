import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const taskData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskData);
    };

    fetchTasks();
  }, []);

  const availableTasks = tasks.filter(task => !task.claimedBy);
  const claimedTasks = tasks.filter(task => task.claimedBy);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🔷 Available Tasks</h2>
          {availableTasks.length === 0 ? (
            <p className="text-gray-500">No available tasks right now.</p>
          ) : (
            <div className="space-y-4">
              {availableTasks.map(task => (
                <Link to={`/tasks/${task.id}`} key={task.id} className="block mb-4">
                  <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
                    <h3 className="text-lg font-semibold text-blue-600">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Posted by: {task.postedBy || 'Unknown'}</p>
                    <p className="text-gray-700">{task.description}</p>
                    <div className="text-sm text-gray-500 mt-2 flex gap-4 items-center">
                      <span>📍 {task.location}</span>
                      <span>💰 ${task.price}</span>
                      <span>🕒 {task.datetime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🔒 Claimed Tasks</h2>
          {claimedTasks.length === 0 ? (
            <p className="text-gray-500">No tasks have been claimed yet.</p>
          ) : (
            <div className="space-y-4">
              {claimedTasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-gray-100 p-4 rounded border ${
                    user && task.claimedBy === user.uid ? 'border-green-400' : 'border-gray-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-700">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Posted by: {task.postedBy || 'Unknown'}</p>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="text-sm text-gray-500 mt-2 flex gap-4 items-center">
                    <span>📍 {task.location}</span>
                    <span>💰 ${task.price}</span>
                    <span>🕒 {task.datetime}</span>
                  </div>
                  {user && task.claimedBy === user.uid && (
                    <p className="mt-1 text-green-600 text-sm font-semibold">✅ Claimed by you</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
