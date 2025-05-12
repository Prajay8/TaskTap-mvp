import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    datetime: ''
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const docRef = doc(db, 'tasks', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTask(data);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            location: data.location || '',
            price: data.price || '',
            datetime: data.datetime || ''
          });
        } else {
          setError('Task not found.');
        }
      } catch (err) {
        setError('Failed to load task.');
      }
      setLoading(false);
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await updateDoc(doc(db, 'tasks', id), {
        ...formData,
        price: Number(formData.price)
      });
      navigate('/my-tasks');
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading task...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Edit Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Price ($)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Date & Time</label>
            <input
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
