import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [user] = useAuthState(auth);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      const taskRef = doc(db, 'tasks', id);
      const taskSnap = await getDoc(taskRef);
      if (taskSnap.exists()) {
        setTask({ id: taskSnap.id, ...taskSnap.data() });
      } else {
        setTask(null);
      }
    };

    fetchTask();
  }, [id]);

  const handleClaim = async () => {
    if (!user) {
      alert('Please log in to claim a task.');
      return;
    }

    if (task.claimedBy) {
      alert('This task has already been claimed.');
      return;
    }

    setClaiming(true);
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        claimedBy: user.uid,
        claimedAt: serverTimestamp(),
      });
      setTask(prev => ({ ...prev, claimedBy: user.uid }));
    } catch (error) {
      console.error('Failed to claim task:', error);
      alert('Something went wrong.');
    }
    setClaiming(false);
  };

  if (task === null) {
    return <p className="text-center mt-20 text-gray-500">Loading task...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">{task.title}</h1>
        <p className="text-gray-700 mb-4">{task.description}</p>

        <ul className="text-sm text-gray-500 space-y-1 mb-6">
          <li><strong>Location:</strong> {task.location}</li>
          <li><strong>Price:</strong> ${task.price}</li>
          <li><strong>Date/Time:</strong> {task.datetime}</li>
        </ul>

        {task.claimedBy ? (
          <button className="w-full bg-gray-300 text-gray-600 py-2 rounded cursor-not-allowed" disabled>
            Task Already Claimed
          </button>
        ) : (
          <button
            onClick={handleClaim}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            disabled={claiming}
          >
            {claiming ? 'Claiming...' : 'Claim This Task'}
          </button>
        )}
      </div>
    </div>
  );
}
