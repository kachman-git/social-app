'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Loader2 } from 'lucide-react'
import PostCard from '@/components/post-card'
import { useToast } from "@/hooks/use-toast"
import type { Post, Profile, User as UserType } from '@/types'
import axios from '@/lib/axios'

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<UserType | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function loadUserData() {
      try {
        // Fetch user data
        const [userResponse, profileResponse, postsResponse] = await Promise.all([
          axios.get(`/users/${params.userId}`),
          axios.get(`/profile/${params.userId}`),
          axios.get(`/post?userId=${params.userId}`)
        ])

        setUser(userResponse.data)
        setProfile(profileResponse.data)
        setPosts(postsResponse.data)
      } catch (error) {
        console.error('Failed to load user data:', error)
        toast({
          variant: "destructive",
          description: "Failed to load user profile.",
        })
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [params.userId, toast, router])

  if (isLoading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              User not found
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {user.username?.[0] || user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-2xl">
              {user.username || user.email}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <Separator className="my-4" />
            <TabsContent value="posts" className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No posts yet
                </div>
              ) : (
                posts.map((post) => (
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
                ))
              )}
            </TabsContent>
            <TabsContent value="about">
              {profile ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                    <p className="text-muted-foreground">
                      {profile.bio || "No bio provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Hobbies</h3>
                    {profile.hobbies && profile.hobbies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.hobbies.map((hobby) => (
                          <Badge key={hobby} variant="secondary">
                            {hobby}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No hobbies listed</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No profile information available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

