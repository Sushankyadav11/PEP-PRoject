export interface User {
  _id: string;
  username: string;
  name: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: User;
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  blog: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}