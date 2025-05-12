import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [postedCount, setPostedCount] = useState(0);
  const [claimedCount, setClaimedCount] = useState(0);
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch profile info from Firestore
      const profileRef = doc(db, 'users', user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setProfileInfo(profileSnap.data());
      }

      // Fetch task stats
      const tasksRef = collection(db, 'tasks');
      const postedQuery = query(tasksRef, where('userId', '==', user.uid));
      const claimedQuery = query(tasksRef, where('claimedBy', '==', user.uid));

      const postedSnap = await getDocs(postedQuery);
      const claimedSnap = await getDocs(claimedQuery);

      setPostedCount(postedSnap.size);
      setClaimedCount(claimedSnap.size);
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (!user) {
    return <p className="text-center mt-20 text-gray-500">Please log in to view your profile.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Your Profile</h2>

        <div className="flex items-center gap-4 mb-6">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full border object-cover"
            />
          )}
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {profileInfo?.firstName || user.displayName || 'N/A'} {profileInfo?.lastName || ''}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        {profileInfo && (
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
            <div>
              <p className="font-semibold">Age:</p>
              <p>{profileInfo.age || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Gender:</p>
              <p>{profileInfo.gender || 'N/A'}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded text-center">
            <p className="text-2xl font-bold">{postedCount}</p>
            <p className="text-sm">Tasks Posted</p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded text-center">
            <p className="text-2xl font-bold">{claimedCount}</p>
            <p className="text-sm">Tasks Claimed</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Log Out
        </button>
        <button
            onClick={() => navigate('/edit-profile')}
            className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
            >
            Edit Profile
        </button>
      </div>
    </div>
  );
}
