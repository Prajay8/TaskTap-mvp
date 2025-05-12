import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function MyTasks() {
  const [user] = useAuthState(auth);
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [postedTasks, setPostedTasks] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const tasksRef = collection(db, 'tasks');

      const q1 = query(tasksRef, where('claimedBy', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap1 = await getDocs(q1);
      setClaimedTasks(snap1.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const q2 = query(tasksRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap2 = await getDocs(q2);
      setPostedTasks(snap2.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchTasks();
  }, [user]);

  const handleDeleteConfirm = (taskId) => {
    setTaskToDelete(taskId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'tasks', taskToDelete));
      setPostedTasks(prev => prev.filter(task => task.id !== taskToDelete));
      setShowModal(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete the task. Please try again.');
    }
  };

  if (!user) {
    return <p className="text-center mt-20 text-gray-500">Please log in to view your tasks.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Claimed Tasks */}
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
                  <div className="text-sm text-gray-500 mt-2">
                    📍 {task.location} | 💰 ${task.price} | 🕒 {task.datetime}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Posted Tasks */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📌 Tasks You've Posted</h2>
          {postedTasks.length === 0 ? (
            <p className="text-gray-500">You haven't posted any tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {postedTasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500 relative">
                  <h3 className="text-lg font-semibold text-gray-700">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    📍 {task.location} | 💰 ${task.price} | 🕒 {task.datetime}
                    {task.claimedBy && (
                      <p className="text-sm text-green-600 mt-1">✅ Claimed</p>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 space-x-2">
                    <a
                      href={`/edit-task/${task.id}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDeleteConfirm(task.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setTaskToDelete(null);
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
