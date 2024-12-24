'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPosts } from '@/lib/api'
import { Post } from '@/types'
import PostCard from '@/components/post-card'
import CreatePostForm from '@/components/create-post-form'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/signin')
      return
    }

    async function loadPosts() {
      try {
        const fetchedPosts = await getPosts()
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Failed to load posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        <CreatePostForm onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
              onPostDeleted={(deletedPostId) => {
                setPosts(posts.filter(p => p.id !== deletedPostId))
              }}
              onPostUpdated={(updatedPost) => {
                setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

