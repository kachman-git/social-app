"use client";

import { useState } from "react";
import Link from "next/link";
import CommentList from "./CommentList";
import EditPostForm from "./EditPostForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquareText } from "lucide-react";

interface PostProps {
  post: {
    id: number;
    title: string;
    description: string;
    userId: number;
    user: {
      email: string;
      username: string;
    };
    comments: {
      id: number;
      text: string;
      userId: number;
      user: {
        email: string;
        username: string;
      };
    }[];
  };
  showComments?: boolean;
  onPostUpdated: (updatedPost: any) => void;
  onPostDeleted: (postId: number) => void;
}

export default function Post({
  post,
  showComments = true,
  onPostUpdated,
  onPostDeleted,
}: PostProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3333/post/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        onPostDeleted(post.id);
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete post",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the post",
      });
    }
  };

  const handlePostUpdated = (updatedPost: any) => {
    setIsEditing(false);
    onPostUpdated(updatedPost);
  };

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.user?.username || post.user?.email}`}
              />
              <AvatarFallback className="dark:bg-blue-700">
                {post.user?.username?.[0].toUpperCase() ||
                  post.user?.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle>
              <Link
                href={`/profile`}
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {post.user?.username || post.user?.email}
              </Link>
            </CardTitle>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <EditPostForm post={post} onPostUpdated={handlePostUpdated} />
        ) : (
          <>
            <div className="text-gray-700 dark:text-gray-300 mb-10">
              <p className="text-xl">{post.title}</p>
              <p>{post.description}</p>
            </div>

            {showComments && (
              <CommentList comments={post.comments} postId={post.id} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
