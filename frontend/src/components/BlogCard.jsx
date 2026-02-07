import React from 'react';
import { Edit2, Languages, Trash2 } from 'lucide-react';

const BlogCard = ({ blog, onEdit, onTranslate, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
        <div className="text-sm text-gray-500 mb-4">
          <p>Créé: {new Date(blog.created_at).toLocaleDateString('fr-FR')}</p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(blog)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            <Edit2 className="w-4 h-4" />
            Éditer
          </button>
          <button
            onClick={() => onTranslate(blog)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition"
          >
            <Languages className="w-4 h-4" />
            Traduire
          </button>
          <button
            onClick={() => onDelete(blog.id)}
            className="flex items-center justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;