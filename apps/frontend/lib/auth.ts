import axios from './axios'
import type { AuthResponse } from '@/types'

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>('/auth/signin', {
    email,
    password,
  })
  return response.data
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>('/auth/signup', {
    email,
    password,
  })
  return response.data
}

