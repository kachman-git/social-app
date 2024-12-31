"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface EditPostFormProps {
  post: {
    id: number;
    title: string;
    description: string;
  };
  onPostUpdated: (updatedPost: any) => void;
}

export default function EditPostForm({
  post,
  onPostUpdated,
}: EditPostFormProps) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://social-app-1l9h.onrender.com/post/${post.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );
      if (response.ok) {
        const updatedPost = await response.json();
        onPostUpdated(updatedPost);
        toast({
          title: "Success",
          description: "Post updated successfully!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update post",
        });
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the post",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Edit your title"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Edit your discription..."
        rows={4}
      />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPostUpdated(post)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || title.trim() === post.title}
        >
          {isSubmitting ? "Updating..." : "Update Post"}
        </Button>
      </div>
    </form>
  );
}
