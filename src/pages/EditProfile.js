import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function EditProfile() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const profileRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(profileRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

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
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        ...formData
      });

      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
  };

  if (!user) return <p className="text-center mt-20 text-gray-500">Please log in to edit your profile.</p>;
  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Edit Profile</h2>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
