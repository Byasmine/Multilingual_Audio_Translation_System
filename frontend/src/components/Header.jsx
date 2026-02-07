import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

const Header = ({ onCreateClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BookOpen className="w-10 h-10 text-indigo-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Blog Manager</h1>
            <p className="text-gray-600 mt-1">Gérez et traduisez vos blogs facilement</p>
          </div>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouveau Blog
        </button>
      </div>
    </div>
  );
};

export default Header;