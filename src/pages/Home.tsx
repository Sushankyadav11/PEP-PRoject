import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BlogCard } from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';
import { Blog } from '../types';
import { PenSquare, Users, MessageSquare, Heart, ChevronRight, Github, Twitter, Linkedin } from 'lucide-react';

const Home = () => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3000/api/blogs');
      return data as Blog[];
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const { data } = await axios.post(
        `http://localhost:3000/api/blogs/${blogId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const benefits = [
    {
      icon: <PenSquare className="h-6 w-6" />,
      title: 'Share Your Stories',
      description: 'Write and publish your thoughts, ideas, and experiences.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Connect with Others',
      description: 'Join a community of passionate writers and readers.',
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Engage in Discussions',
      description: 'Comment on posts and participate in meaningful conversations.',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Banner */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:16px_16px]"></div>
        <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to ModernBlog
          </h1>
          <p className="text-xl mb-8 text-indigo-100">
            Discover and share inspiring stories, ideas, and thoughts.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Sign Up to Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
              >
                Log In to Explore
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Latest Posts */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
          {user && (
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Write a Post
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onLike={(blogId) => likeMutation.mutate(blogId)}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      {!user && (
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Join Our Community?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About ModernBlog</h2>
          <p className="text-lg text-gray-600 mb-8">
            ModernBlog is a platform created for passionate writers and readers to share
            their stories, ideas, and experiences. Our community celebrates creativity,
            encourages meaningful discussions, and connects people through the power of
            writing.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-500"
          >
            Join our community
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">ModernBlog</h3>
            <p className="text-gray-600 text-sm">
              Share your stories with the world.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} ModernBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;