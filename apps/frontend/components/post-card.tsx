'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createComment, deleteComment, editComment, editPost, deletePost } from '@/lib/api'
import { MessageSquare, User, Edit, Trash2, X, Check } from 'lucide-react'
import type { Post, Comment } from '@/types'
import { Separator } from './ui/separator'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

export default function PostCard({ post: initialPost }: { post: Post }) {
  const { user } = useAuth()
  const router = useRouter()
  const [post, setPost] = useState(initialPost)
  const [comments, setComments] = useState(post.comments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(post.title)
  const [editedDescription, setEditedDescription] = useState(post.description)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const isPostOwner = user?.id === post.userId

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const comment = await createComment({
        text: newComment,
        postId: post.id,
      })
      setComments([...comments, comment])
      setNewComment('')
      toast({
        description: "Comment posted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to post comment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEditPost() {
    try {
      const updatedPost = await editPost(post.id, {
        title: editedTitle,
        description: editedDescription,
      })
      setPost({ ...post, ...updatedPost })
      setIsEditing(false)
      toast({
        description: "Post updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update post.",
      })
    }
  }

  async function handleDeletePost() {
    try {
      setIsDeleting(true)
      await deletePost(post.id)
      toast({
        description: "Post deleted successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete post.",
      })
      setIsDeleting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarFallback>
            {post.user.username?.[0] || post.user.email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-semibold">{post.user.username ?? post.user.email}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </p>
        </div>
        {isPostOwner && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditPost}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedTitle(post.title)
                    setEditedDescription(post.description)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Post</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this post? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="destructive"
                        onClick={handleDeletePost}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-lg font-semibold"
              />
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          ) : (
            <>
              <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {post.title}
              </h2>
              <p className="leading-7 text-muted-foreground [&:not(:first-child)]:mt-2">
                {post.description}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            {comments.length} comments
          </Button>
        </div>
      </CardContent>
      {isExpanded && (
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <div className="w-full space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={async (commentId) => {
                  await deleteComment(commentId)
                  setComments(comments.filter(c => c.id !== commentId))
                }}
                onEdit={async (commentId, text) => {
                  const updatedComment = await editComment(commentId, text)
                  setComments(comments.map(c => 
                    c.id === commentId ? { ...c, text: updatedComment.text } : c
                  ))
                }}
              />
            ))}
          </div>
          {user ? (
            <form onSubmit={handleSubmitComment} className="w-full space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none"
              />
              <Button type="submit" disabled={isSubmitting} size="sm">
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
          ) : (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Please{' '}
                <Link href="/signin" className="text-primary hover:underline">
                  sign in
                </Link>
                {' '}to comment on this post
              </p>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: number) => Promise<void>;
  onEdit: (commentId: number, text: string) => Promise<void>;
}

function CommentItem({ comment, onDelete, onEdit }: CommentItemProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(comment.text)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleEdit = async () => {
    try {
      await onEdit(comment.id, editedText)
      setIsEditing(false)
      toast({
        description: "Comment updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update comment.",
      })
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(comment.id)
      toast({
        description: "Comment deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete comment.",
      })
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-start space-x-2">
      <Avatar className="h-6 w-6">
        <AvatarFallback>
          {comment.user.username?.[0] || comment.user.email?.[0]?.toUpperCase() || <User className="h-3 w-3" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium leading-none">
              {comment.user.username || comment.user.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </p>
          </div>
          {user?.id === comment.userId && (
            <div className="flex items-center space-x-1">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleEdit}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setIsEditing(false)
                      setEditedText(comment.text)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Comment</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this comment? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="mt-2 resize-none"
          />
        ) : (
          <p className="text-sm text-muted-foreground">{comment.text}</p>
        )}
      </div>
    </div>
  )
}

