import express from 'express';
import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username name' },
      })
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username name' },
      });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog' });
  }
});

// Get user's blogs
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId })
      .populate('author', 'username name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username name' },
      })
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user blogs' });
  }
});

// Create new blog
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({
      title,
      content,
      author: req.userId,
    });
    await blog.save();
    
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username name');
    
    res.status(201).json(populatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog' });
  }
});

// Delete blog
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.userId });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    await Comment.deleteMany({ blog: req.params.id });
    await blog.deleteOne();
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog' });
  }
});

// Like/Unlike blog
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const likedIndex = blog.likedBy.indexOf(req.userId);
    if (likedIndex === -1) {
      blog.likedBy.push(req.userId);
      blog.likes += 1;
    } else {
      blog.likedBy.splice(likedIndex, 1);
      blog.likes -= 1;
    }

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating like' });
  }
});

// Add comment
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new Comment({
      content,
      author: req.userId,
      blog: req.params.id,
    });
    await comment.save();

    const blog = await Blog.findById(req.params.id);
    blog.comments.push(comment._id);
    await blog.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username name');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

export default router;