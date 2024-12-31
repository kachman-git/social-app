"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface EditCommentFormProps {
  comment: {
    id: number;
    text: string;
  };
  onCommentUpdated: (updatedComment: any) => void;
}

export default function EditCommentForm({
  comment,
  onCommentUpdated,
}: EditCommentFormProps) {
  const [text, setText] = useState(comment.text);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://social-app-1l9h.onrender.com/comment/${comment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );
      if (response.ok) {
        const updatedComment = await response.json();
        onCommentUpdated(updatedComment);
        toast({
          title: "Success",
          description: "Comment updated successfully!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update comment",
        });
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the comment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Edit your comment..."
        rows={2}
      />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onCommentUpdated(comment)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || text.trim() === comment.text}
        >
          {isSubmitting ? "Updating..." : "Update Comment"}
        </Button>
      </div>
    </form>
  );
}
