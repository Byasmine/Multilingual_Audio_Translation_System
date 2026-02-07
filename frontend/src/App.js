import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BlogList from './components/BlogList';
import BlogModal from './components/BlogModal';
import TranslationModal from './components/TranslationModal';
import * as blogService from './services/blogService';
import './App.css';

function App() {
  // États
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  
  // Données
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [translationForm, setTranslationForm] = useState({ source: 'auto', target: 'en' });
  const [translationResult, setTranslationResult] = useState(null);

  // Charger les blogs au démarrage
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch tous les blogs
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Créer un blog
  const handleCreateBlog = async () => {
    if (!formData.title || !formData.content) {
      setError('Titre et contenu requis');
      return;
    }
    setLoading(true);
    try {
      await blogService.createBlog(formData);
      await fetchBlogs();
      setShowCreateModal(false);
      setFormData({ title: '', content: '' });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le modal d'édition
  const handleOpenEdit = (blog) => {
    setSelectedBlog(blog);
    setFormData({ title: blog.title, content: blog.content });
    setShowEditModal(true);
    setError(null);
  };

  // Mettre à jour un blog
  const handleUpdateBlog = async () => {
    if (!formData.title || !formData.content) {
      setError('Titre et contenu requis');
      return;
    }
    setLoading(true);
    try {
      await blogService.updateBlog(selectedBlog.id, formData);
      await fetchBlogs();
      setShowEditModal(false);
      setSelectedBlog(null);
      setFormData({ title: '', content: '' });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce blog ?')) return;
    setLoading(true);
    try {
      await blogService.deleteBlog(id);
      await fetchBlogs();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le modal de traduction
  const handleOpenTranslation = (blog) => {
    setSelectedBlog(blog);
    setTranslationResult(null);
    setShowTranslationModal(true);
    setError(null);
  };

  // Traduire un blog
  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.translateBlog(
        selectedBlog.id,
        translationForm.source,
        translationForm.target
      );
      setTranslationResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Jouer l'audio
  const handlePlayAudio = () => {
    if (!translationResult?.audio_path) return;
    const audioUrl = blogService.getAudioUrl(translationResult.audio_path);
    const audio = new Audio(audioUrl);
    audio.play().catch(err => setError('Erreur lors de la lecture audio'));
  };

  // Reset traduction
  const handleResetTranslation = () => {
    setTranslationResult(null);
  };

  // Fermer le modal de traduction
  const handleCloseTranslation = () => {
    setShowTranslationModal(false);
    setSelectedBlog(null);
    setTranslationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header onCreateClick={() => setShowCreateModal(true)} />

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg animate-shake">
            <div className="flex items-center justify-between">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="text-red-600 text-sm font-semibold hover:text-red-800 underline"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Liste des blogs */}
        <BlogList
          blogs={blogs}
          loading={loading}
          onEdit={handleOpenEdit}
          onTranslate={handleOpenTranslation}
          onDelete={handleDeleteBlog}
        />

        {/* Modal Création */}
        <BlogModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setFormData({ title: '', content: '' });
          }}
          title="Créer un nouveau blog"
          formData={formData}
          onChange={setFormData}
          onSubmit={handleCreateBlog}
          mode="create"
        />

        {/* Modal Édition */}
        <BlogModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBlog(null);
            setFormData({ title: '', content: '' });
          }}
          title="Éditer le blog"
          formData={formData}
          onChange={setFormData}
          onSubmit={handleUpdateBlog}
          mode="edit"
        />

        {/* Modal Traduction */}
        <TranslationModal
          isOpen={showTranslationModal}
          onClose={handleCloseTranslation}
          blog={selectedBlog}
          translationForm={translationForm}
          onTranslationFormChange={setTranslationForm}
          onTranslate={handleTranslate}
          translationResult={translationResult}
          onPlayAudio={handlePlayAudio}
          onReset={handleResetTranslation}
        />
      </div>
    </div>
  );
}

export default App;