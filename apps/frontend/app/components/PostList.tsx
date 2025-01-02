"use client";

import { useEffect, useState } from "react";
import Post from "./Post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PostData {
  id: number;
  title: string;
  description: string;
  userId: number;
  user: {
    email: string;
    username: string;
  };
  comments: CommentData[];
}

interface CommentData {
  id: number;
  text: string;
  userId: number;
  user: {
    email: string;
    username: string;
  };
}

export default function PostList() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://social-app-production-c882.up.railway.app/post",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostUpdated = (updatedPost: PostData) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handlePostDeleted = (deletedPostId: number) => {
    setPosts(posts.filter((post) => post.id !== deletedPostId));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full mb-4" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-9">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted}
          />
        ))}
      </CardContent>
    </Card>
  );
}
