import axios from './axios';
import type { Comment, Post } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function signIn(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to sign in');
  }
  
  return res.json();
}

export async function signUp(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to sign up');
  }
  
  return res.json();
}

// Update existing API functions to include authorization header
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Post endpoints
export async function getPosts() {
  const response = await axios.get<Post[]>('/post');
  return response.data;
}

export async function getPostById(postId: number) {
  const response = await axios.get<Post>(`/post/${postId}`);
  return response.data;
}

export async function createPost(data: { title: string; description: string }) {
  const response = await axios.post<Post>('/post', data);
  return response.data;
}

export async function editPost(postId: number, data: { title?: string; description?: string }) {
  const response = await axios.patch<Post>(`/post/${postId}`, data);
  return response.data;
}

export async function deletePost(postId: number) {
  await axios.delete(`/post/${postId}`);
}

export async function getComments() {
  const response = await axios.get('/comment');
  return response.data;
}

export async function createComment(data: { text: string; postId: number }) {
  const response = await axios.post<Comment>('/comment', data);
  return response.data;
}

export async function editComment(commentId: number, text: string) {
  const response = await axios.patch<Comment>(`/comment/${commentId}`, { text });
  return response.data;
}

export async function deleteComment(commentId: number) {
  await axios.delete(`/comment/${commentId}`);
}

// Profile endpoints
export async function getProfiles() {
  const response = await axios.get('/profile');
  return response.data;
}

export async function getProfileById(profileId: number) {
  const response = await axios.get(`/profile/${profileId}`);
  return response.data;
}

export async function createProfile(data: { bio: string; hobbies: string[] }) {
  const response = await axios.post('/profile', data);
  return response.data;
}

export async function editProfile(profileId: number, data: { bio?: string; hobbies?: string[] }) {
  const response = await axios.patch(`/profile/${profileId}`, data);
  return response.data;
}

export async function deleteProfile(profileId: number) {
  await axios.delete(`/profile/${profileId}`);
}

// User endpoints
export async function getMe() {
  const response = await axios.get('/users/me');
  return response.data;
}

export async function editUser(data: { email?: string; username?: string }) {
  const response = await axios.patch('/users', data);
  return response.data;
}

