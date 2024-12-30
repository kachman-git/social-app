"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Post from "../components/Post";
import Comment from "../components/Comment";

interface UserProfile {
  id: number;
  email: string;
  username: string;
}

interface ProfileData {
  id: number;
  bio: string;
  userId: number;
  hobbies: string[];
}

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
  postId: number;
  user: {
    email: string;
    username: string;
  };
}

export default function UserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [userResponse, profileResponse, postsResponse, commentsResponse] =
          await Promise.all([
            fetch(`http://localhost:3333/users/me`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:3333/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:3333/post/me`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:3333/comment`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (
          userResponse.ok &&
          profileResponse.ok &&
          postsResponse.ok &&
          commentsResponse.ok
        ) {
          const [userData, profileData, postsData, commentsData] =
            await Promise.all([
              userResponse.json(),
              profileResponse.json(),
              postsResponse.json(),
              commentsResponse.json(),
            ]);

          setUser(userData);
          setProfile(profileData);
          setPosts(postsData);
          setComments(commentsData);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred while fetching the user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-12 w-[250px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-[200px] mb-4" />
          <Skeleton className="h-4 w-[300px] mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!user || !profile) {
    return (
      <Card>
        <CardContent>
          <p className="text-center">User not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.username || user?.email}`}
            />
            <AvatarFallback>
              {user?.username?.[0] || user?.email[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl">
              {user?.username || user?.email}
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Bio</h3>
              <p>{profile.bio || "No bio available"}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Hobbies</h3>
              {profile.hobbies && profile.hobbies.length > 0 ? (
                <ul className="list-disc list-inside">
                  {profile.hobbies.map((hobby, index) => (
                    <li key={index}>{hobby}</li>
                  ))}
                </ul>
              ) : (
                <p>No hobbies listed</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-4 mt-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Post
                    key={post.id}
                    post={post}
                    onPostUpdated={() => {}}
                    onPostDeleted={() => {}}
                  />
                ))
              ) : (
                <p>No posts yet</p>
              )}
            </TabsContent>
            <TabsContent value="comments" className="space-y-4 mt-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-4">
                      <Comment
                        comment={comment}
                        onCommentUpdated={() => {}}
                        onCommentDeleted={() => {}}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        On post: {comment.postId}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No comments yet</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
