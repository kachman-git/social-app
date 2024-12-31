"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CreateCommentFormProps {
  postId: number;
  onCommentCreated: (comment: any) => void;
}

export default function CreateCommentForm({
  postId,
  onCommentCreated,
}: CreateCommentFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://social-app-1l9h.onrender.com/comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text, postId }),
        }
      );
      if (response.ok) {
        const newComment = await response.json();
        setText("");
        onCommentCreated(newComment);
        toast({
          title: "Success",
          description: "Comment added successfully!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to add comment",
        });
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the comment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        rows={2}
        className="mb-2"
      />
      <Button
        type="submit"
        disabled={isSubmitting || text.trim().length === 0}
        className="w-full"
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
