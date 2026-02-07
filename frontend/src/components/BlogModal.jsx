import React from 'react';
import { X, Save } from 'lucide-react';

const BlogModal = ({ 
  isOpen, 
  onClose, 
  title, 
  formData, 
  onChange, 
  onSubmit,
  mode = 'create' // 'create' ou 'edit'
}) => {
  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onChange({ ...formData, title: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Entrez le titre du blog"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Contenu</label>
            <textarea
              value={formData.content}
              onChange={(e) => onChange({ ...formData, content: e.target.value })}
              rows="8"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Écrivez votre contenu ici..."
            />
          </div>

          <button
            onClick={onSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {mode === 'create' ? 'Créer le blog' : 'Mettre à jour'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;