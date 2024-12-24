'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'
import axios from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`
          const response = await axios.get('/users/me')
          setUser(response.data)
        } catch (error) {
          console.error('Auth initialization error:', error)
          localStorage.removeItem('token')
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
          delete axios.defaults.headers.common['Authorization']
        }
      }
      setIsInitializing(false)
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (token: string, user: User) => {
    try {
      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast({
        variant: "destructive",
        description: "Failed to complete login. Please try again.",
      })
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    router.push('/signin')
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        updateUser, 
        isLoading, 
        isInitializing 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

