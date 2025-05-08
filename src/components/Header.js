import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          TaskTap
        </Link>

        <nav className="flex gap-4 text-gray-700 text-sm sm:text-base">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/post-task" className="hover:text-blue-600 transition">Post Task</Link>
          <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
        </nav>
      </div>
    </header>
  );
}
