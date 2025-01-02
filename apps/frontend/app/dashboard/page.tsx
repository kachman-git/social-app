"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import CreatePostForm from "../components/CreatePostForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: number;
  email: string;
  username: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }
      try {
        const response = await fetch(
          "https://social-app-production-c882.up.railway.app/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user)
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[250px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
            Welcome, {user?.username || user?.email}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePostForm />
        </CardContent>
      </Card>
      <PostList />
    </div>
  );
}
