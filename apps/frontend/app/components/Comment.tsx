"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import EditCommentForm from "./EditCommentForm";
import { User } from "lucide-react";

interface CommentProps {
  comment: {
    id: number;
    text: string;
    userId: number;
    user: {
      email: string;
      username: string;
    };
  };
  showUserInfo?: boolean;
  onCommentUpdated: (updatedComment: any) => void;
  onCommentDeleted: (commentId: number) => void;
}

export default function Comment({
  comment,
  showUserInfo = true,
  onCommentUpdated,
  onCommentDeleted,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3333/comment/${comment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        onCommentDeleted(comment.id);
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete comment",
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the comment",
      });
    }
  };

  const handleCommentUpdated = (updatedComment: any) => {
    setIsEditing(false);
    onCommentUpdated(updatedComment);
  };

  return (
    <div className="flex items-start space-x-4">
      {showUserInfo && (
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.user?.username || comment.user?.email}`}
          />
          <AvatarFallback>
            {comment.user?.username?.[0].toUpperCase() ||
              comment.user?.email[0].toUpperCase() || (
                <User width={20} height={20} />
              )}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex-grow">
        {showUserInfo && (
          <Link
            href={`/profile`}
            className="font-bold text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {comment.user?.username || comment.user?.email}
          </Link>
        )}
        {isEditing ? (
          <EditCommentForm
            comment={comment}
            onCommentUpdated={handleCommentUpdated}
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
            {comment.text}
          </p>
        )}
      </div>
      {!isEditing && (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
