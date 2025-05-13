import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function PostTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      price: Number(price),
      location,
      datetime: `${date} ${time}`,
      userId: user?.uid,
      postedBy: user?.displayName || user?.email || 'Unknown',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'tasks'), taskData);
      setMessageType('success');
      setMessage('🎉 Task posted successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setDate('');
      setTime('');
    } catch (error) {
      console.error('Error posting task:', error);
      setMessageType('error');
      setMessage('❌ Failed to post task. Please try again.');
    }

    setTimeout(() => setMessage(null), 3000); // auto-dismiss after 3s
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-4">

        {message && (
          <div
            className={`text-sm px-4 py-3 rounded shadow-md transition ${
              messageType === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Post a Task</h2>

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            required
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded resize-none"
            rows={3}
            required
          />

          <input
            type="number"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            required
          />

          <div className="flex gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-1/2 border border-gray-300 px-4 py-2 rounded"
              required
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-1/2 border border-gray-300 px-4 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Post Task
          </button>
        </form>
      </div>
    </div>
  );
}
