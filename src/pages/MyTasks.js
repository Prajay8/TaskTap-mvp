import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function MyTasks() {
  const [user] = useAuthState(auth);
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [postedTasks, setPostedTasks] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const tasksRef = collection(db, 'tasks');

      // Claimed by me
      const q1 = query(tasksRef, where('claimedBy', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap1 = await getDocs(q1);
      setClaimedTasks(snap1.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Posted by me
      const q2 = query(tasksRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap2 = await getDocs(q2);
      setPostedTasks(snap2.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchTasks();
  }, [user]);

  if (!user) {
    return <p className="text-center mt-20 text-gray-500">Please log in to view your tasks.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">✅ Tasks You've Claimed</h2>
          {claimedTasks.length === 0 ? (
            <p className="text-gray-500">You haven't claimed any tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {claimedTasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded shadow border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-700">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="text-sm text-gray-500 mt-2 flex gap-4 items-center">
                        <span>📍 {task.location}</span>
                        <span>💰 ${task.price}</span>
                        <span>🕒 {task.datetime}</span>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📌 Tasks You've Posted</h2>
          {postedTasks.length === 0 ? (
            <p className="text-gray-500">You haven't posted any tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {postedTasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-700">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="text-sm text-gray-500 mt-2 flex gap-4 items-center">
                        <span>📍 {task.location}</span>
                        <span>💰 ${task.price}</span>
                        <span>🕒 {task.datetime}</span>
                        {task.claimedBy && (
                      <p className="text-sm text-green-600 mt-1">✅ Claimed</p>
                        )}
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
