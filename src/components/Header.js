import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          TaskTap
        </Link>

        <nav className="flex gap-4 items-center text-gray-700 text-sm sm:text-base">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          {user && (
            <>
              <Link to="/post-task" className="hover:text-blue-600 transition">Post Task</Link>
              <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
              <Link to="/signup" className="hover:text-blue-600 transition">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
