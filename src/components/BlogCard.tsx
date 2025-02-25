import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock, Trash2 } from 'lucide-react';
import { Blog } from '../types';

interface BlogCardProps {
  blog: Blog;
  onLike: (blogId: string) => void;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike, showDeleteButton, onDelete }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          {showDeleteButton && onDelete && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete post"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Link to={`/blog/${blog._id}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
            {blog.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-4">
          {blog.content.length > 150
            ? `${blog.content.substring(0, 150)}...`
            : blog.content}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(blog._id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span>{blog.likes}</span>
            </button>
            
            <Link
              to={`/blog/${blog._id}`}
              className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{blog.comments.length}</span>
            </Link>
          </div>
          
          <Link
            to={`/profile/${blog.author._id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            By {blog.author.name}
          </Link>
        </div>
      </div>
    </div>
  );
};