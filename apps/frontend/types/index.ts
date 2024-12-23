export interface User {
  id: number;
  email: string;
  username?: string;
  createdAt: string;
  updateAt: string;
  profile?: Profile;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Profile {
  id: number;
  bio: string;
  hobbies: string[];
  userId: number;
  user: User;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  userId: number;
  user: User;
  comments: Comment[];
  createdAt: string;
  updateAt: string;
}

export interface Comment {
  id: number;
  text: string;
  userId: number;
  user: User;
  postId: number;
  post: Post;
  createdAt: string;
  updateAt: string;
}

