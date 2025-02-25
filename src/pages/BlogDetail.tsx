import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Clock, User } from 'lucide-react';
import type { Blog, Comment } from '../types';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = React.useState('');

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/blogs/${id}`);
      return data as Blog;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `http://localhost:3000/api/blogs/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await axios.post(
        `http://localhost:3000/api/blogs/${id}/comments`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data as Comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      setComment('');
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (comment.trim()) {
      commentMutation.mutate(comment);
    }
  };

  if (isLoading || !blog) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock className="h-5 w-5" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-indigo-600 font-medium">{blog.author.name}</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
          <div className="prose max-w-none">{blog.content}</div>

          <div className="flex items-center space-x-6 mt-8 pt-6 border-t">
            <button
              onClick={() => likeMutation.mutate()}
              disabled={!user}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className="h-6 w-6" />
              <span>{blog.likes}</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-500">
              <MessageCircle className="h-6 w-6" />
              <span>{blog.comments.length}</span>
            </div>
          </div>
        </div>
      </article>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        
        {user && (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="sr-only">
                Add a comment
              </label>
              <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commentMutation.isPending}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {blog.comments.map((comment) => (
            <div key={comment._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-900">{comment.author.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;