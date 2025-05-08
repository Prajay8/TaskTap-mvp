import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
        Welcome to TaskTap
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-6">
        A trusted local marketplace to get small tasks done — or earn extra by helping people around you.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/signup">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition">
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button className="border border-gray-400 text-gray-700 px-6 py-3 rounded-lg text-lg hover:bg-gray-100 transition">
            I already have an account
          </button>
        </Link>
      </div>

      <p className="mt-8 text-sm text-gray-400">📍 Serving UT Dallas & nearby communities</p>
    </div>
  );
}
