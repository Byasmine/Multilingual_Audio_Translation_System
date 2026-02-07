const API_BASE_URL = 'http://localhost:5000';

// Récupérer tous les blogs
export const getAllBlogs = async () => {
  const response = await fetch(`${API_BASE_URL}/blogs`);
  if (!response.ok) throw new Error('Erreur lors du chargement des blogs');
  return response.json();
};

// Récupérer un blog par ID
export const getBlogById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
  if (!response.ok) throw new Error('Blog non trouvé');
  return response.json();
};

// Créer un nouveau blog
export const createBlog = async (blogData) => {
  const response = await fetch(`${API_BASE_URL}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData)
  });
  if (!response.ok) throw new Error('Erreur lors de la création du blog');
  return response.json();
};

// Mettre à jour un blog
export const updateBlog = async (id, blogData) => {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData)
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour');
  return response.json();
};

// Supprimer un blog
export const deleteBlog = async (id) => {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression');
  return response.json();
};

// Traduire un blog
export const translateBlog = async (id, source, target) => {
  const sourceParam = source === 'auto' ? '' : `source=${source}&`;
  const response = await fetch(
    `${API_BASE_URL}/blogs/${id}/translate?${sourceParam}target=${target}`
  );
  if (!response.ok) throw new Error('Erreur lors de la traduction');
  return response.json();
};

// Obtenir l'URL complète pour l'audio
export const getAudioUrl = (audioPath) => {
  return `${API_BASE_URL}${audioPath}`;
};