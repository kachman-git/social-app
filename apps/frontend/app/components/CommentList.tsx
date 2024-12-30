"use client";

import { useState } from "react";
import Comment from "./Comment";
import CreateCommentForm from "./CreateCommentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommentData {
  id: number;
  text: string;
  userId: number;
  user: {
    email: string;
    username: string;
  };
}

interface CommentListProps {
  comments: CommentData[];
  postId: number;
}

export default function CommentList({
  comments: initialComments,
  postId,
}: CommentListProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);

  const addComment = (newComment: CommentData) => {
    setComments([...comments, newComment]);
  };

  const handleCommentUpdated = (updatedComment: CommentData) => {
    setComments(
      comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (deletedCommentId: number) => {
    setComments(comments.filter((comment) => comment.id !== deletedCommentId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
          />
        ))}
        <CreateCommentForm postId={postId} onCommentCreated={addComment} />
      </CardContent>
    </Card>
  );
}
