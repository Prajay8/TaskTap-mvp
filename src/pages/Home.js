import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
          Welcome to TaskTap
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
          TaskTap helps you get small tasks done fast — or earn extra by helping people near you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            I already have an account
          </Link>
        </div>
      </div>

      <div className="bg-white py-12 px-6 mt-10 shadow-inner">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <p>Post a task in seconds. Taskers nearby can pick it up instantly.</p>
          <p>Earn money doing simple things like moving boxes, setting up furniture, or grabbing groceries.</p>
          <p>Students, part-timers, and neighbors — all trusted, reviewed, and nearby.</p>
        </div>
      </div>
    </div>
  );
}
