import React from 'react';
import { X, Languages, Volume2 } from 'lucide-react';

const TranslationModal = ({ 
  isOpen, 
  onClose, 
  blog,
  translationForm,
  onTranslationFormChange,
  onTranslate,
  translationResult,
  onPlayAudio,
  onReset
}) => {
  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Traduire: {blog.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {!translationResult ? (
            /* Formulaire de traduction */
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Langue source</label>
                <select
                  value={translationForm.source}
                  onChange={(e) => onTranslationFormChange({ ...translationForm, source: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="auto">Détection automatique</option>
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                  <option value="ar">Arabe</option>
                  <option value="it">Italien</option>
                  <option value="pt">Portugais</option>
                  <option value="ru">Russe</option>
                  <option value="zh">Chinois</option>
                  <option value="ja">Japonais</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Langue cible</label>
                <select
                  value={translationForm.target}
                  onChange={(e) => onTranslationFormChange({ ...translationForm, target: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="en">Anglais</option>
                  <option value="fr">Français</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                  <option value="ar">Arabe</option>
                  <option value="it">Italien</option>
                  <option value="pt">Portugais</option>
                  <option value="ru">Russe</option>
                  <option value="zh">Chinois</option>
                  <option value="ja">Japonais</option>
                </select>
              </div>
              
              <button
                onClick={onTranslate}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Languages className="w-5 h-5" />
                Traduire maintenant
              </button>
            </div>
          ) : (
            /* Résultat de la traduction */
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">Contenu original</h3>
                <p className="text-gray-700">{translationResult.original_content}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">Traduction</h3>
                <p className="text-gray-700">{translationResult.translated_content}</p>
                <div className="mt-3 text-sm text-gray-600">
                  <p>De: {translationResult.translation_info.from} → Vers: {translationResult.translation_info.to}</p>
                </div>
              </div>
              
              {translationResult.audio_path && (
                <button
                  onClick={onPlayAudio}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Écouter la traduction
                </button>
              )}
              
              <button
                onClick={onReset}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Nouvelle traduction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationModal;