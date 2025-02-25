import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BlogCard } from '../components/BlogCard';
import { User, Settings } from 'lucide-react';
import type { Blog } from '../types';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['userBlogs'],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/blogs/user/${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data as Blog[];
    },
    enabled: !!user,
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      await axios.delete(`http://localhost:3000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBlogs'] });
    },
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500">@{user?.username}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Post
          </button>
        </div>

        {blogs?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">Start writing your first blog post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onLike={() => {}}
                showDeleteButton
                onDelete={() => deleteBlogMutation.mutate(blog._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;