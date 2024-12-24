'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createComment, deleteComment, editComment, editPost, deletePost } from '@/lib/api'
import { MessageSquare, User, Edit, Trash2, X, Check, Heart, Loader2 } from 'lucide-react'
import type { Post, Comment } from '@/types'
import { Separator } from './ui/separator'
import { useAuth } from '@/contexts/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: number) => void;
  onPostUpdated?: (post: Post) => void;
}

export default function PostCard({ 
  post: initialPost, 
  onPostDeleted,
  onPostUpdated 
}: PostCardProps) {
  const { user } = useAuth()
  const [post, setPost] = useState(initialPost)
  const [comments, setComments] = useState(post.comments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(post.title)
  const [editedDescription, setEditedDescription] = useState(post.description)
  const [isDeleting, setIsDeleting] = useState(false)
  const [liked, setLiked] = useState(false)
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
      setPost(updatedPost)
      onPostUpdated?.(updatedPost)
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
      onPostDeleted?.(post.id)
      toast({
        description: "Post deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete post.",
      })
      setIsDeleting(false)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    // Here you would typically make an API call to update likes
    toast({
      description: liked ? "Post unliked" : "Post liked",
    })
  }

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Link href={`/users/${post.userId}`} className="transition-transform hover:scale-105">
          <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-background">
            <AvatarFallback className="bg-primary/10 text-primary">
              {post.user.username?.[0] || post.user.email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-1 flex-col">
          <Link 
            href={`/users/${post.userId}`} 
            className="text-sm font-semibold hover:underline inline-flex items-center gap-2 text-primary"
          >
            {post.user.username ?? post.user.email}
            {post.user.username && (
              <span className="text-xs text-muted-foreground font-normal">
                @{post.user.email.split('@')[0]}
              </span>
            )}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </p>
        </div>
        {isPostOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="w-40"
            >
              <DropdownMenuItem 
                onClick={() => setIsEditing(true)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-lg font-semibold border-primary/20 focus-visible:ring-primary/20"
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="min-h-[100px] border-primary/20 focus-visible:ring-primary/20"
            />
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={handleEditPost}
                className="gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false)
                  setEditedTitle(post.title)
                  setEditedDescription(post.description)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {post.title}
            </h2>
            <p className="leading-7 text-muted-foreground">
              {post.description}
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-muted-foreground transition-colors",
              liked && "text-red-500 bg-red-50 dark:bg-red-950/50"
            )}
            onClick={handleLike}
          >
            <Heart 
              className={cn(
                "h-4 w-4 mr-1 transition-all", 
                liked && "fill-current scale-110"
              )} 
            />
            {liked ? 'Liked' : 'Like'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "text-muted-foreground transition-colors",
              isExpanded && "bg-muted"
            )}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            {comments.length} comments
          </Button>
        </div>
      </CardContent>
      {isExpanded && (
        <CardFooter className="flex flex-col space-y-4 animate-in slide-in-from-top-2 duration-200">
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
                className="resize-none min-h-[80px] border-primary/20 focus-visible:ring-primary/20"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                size="sm"
                className="gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Post Comment
              </Button>
            </form>
          ) : (
            <div className="text-center p-4 bg-muted rounded-lg border border-primary/10">
              <p className="text-sm text-muted-foreground">
                Please{' '}
                <Link href="/signin" className="text-primary hover:underline font-medium">
                  sign in
                </Link>
                {' '}to comment on this post
              </p>
            </div>
          )}
        </CardFooter>
      )}
      <Dialog>
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
              className="gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
    <div className="flex items-start space-x-2 group animate-in slide-in-from-top-1 duration-200">
      <Link href={`/users/${comment.userId}`} className="transition-transform hover:scale-105">
        <Avatar className="h-6 w-6 ring-1 ring-background">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {comment.user.username?.[0] || comment.user.email[0].toUpperCase() || <User className="h-3 w-3" />}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link 
              href={`/users/${comment.userId}`}
              className="text-sm font-medium leading-none hover:underline text-primary"
            >
              {comment.user.username || comment.user.email}
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </span>
          </div>
          {user?.id === comment.userId && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/50"
                    onClick={handleEdit}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
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
                    className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
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
                          className="gap-2"
                        >
                          {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                          Delete
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
            className="mt-2 resize-none min-h-[60px] border-primary/20 focus-visible:ring-primary/20"
          />
        ) : (
          <p className="text-sm text-muted-foreground">{comment.text}</p>
        )}
      </div>
    </div>
  )
}

