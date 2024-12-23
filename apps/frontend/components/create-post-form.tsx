'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createPost } from '@/lib/api'
import { PenLine } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

export default function CreatePostForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Please{' '}
              <Link href="/signin" className="underline">
                sign in
              </Link>
              {' '}to create a post
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title || !description) return

    setIsSubmitting(true)
    try {
      await createPost({ title, description })
      router.refresh()
      e.currentTarget.reset()
      setIsExpanded(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isExpanded) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            onClick={() => setIsExpanded(true)}
          >
            <PenLine className="mr-2 h-4 w-4" />
            What's on your mind?
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              name="title"
              placeholder="Post title"
              required
              className="text-lg font-medium"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              name="description"
              placeholder="What's on your mind?"
              required
              className="min-h-[100px]"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

