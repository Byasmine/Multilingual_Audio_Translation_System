import React from 'react';
import BlogCard from './BlogCard';

const BlogList = ({ blogs, loading, onEdit, onTranslate, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <p className="text-gray-600 text-lg">Aucun blog pour le moment.</p>
        <p className="text-gray-500 mt-2">Cliquez sur "Nouveau Blog" pour commencer !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onEdit={onEdit}
          onTranslate={onTranslate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BlogList;