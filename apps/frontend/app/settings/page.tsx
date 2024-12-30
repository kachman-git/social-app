"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

const settingsSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  hobbies: z
    .array(z.object({ value: z.string() }))
    .max(20, "You can add up to 20 hobbies")
    .optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

let userDataId: number;
let profileDataId: number;

export default function Settings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      email: "",
      username: "",
      bio: "",
      hobbies: [],
    },
  });

  const { fields, append, remove } = useFieldArray<SettingsFormData>({
    control,
    name: "hobbies",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }
      try {
        const [userResponse, profileResponse] = await Promise.all([
          fetch("http://localhost:3333/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:3333/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (userResponse.ok && profileResponse.ok) {
          const userData = await userResponse.json();
          const profileData = await profileResponse.json();
          userDataId = userData.id;
          profileDataId = profileData.id;
          reset({
            ...userData,
            ...profileData[0],
            hobbies:
              profileData[0]?.hobbies?.map((hobby: string) => ({
                value: hobby,
              })) || [],
          });
        } else {
          localStorage.removeItem("token");
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
        });
      } finally {
        console.log({ userDataId, profileDataId });
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router, reset, toast]);

  const onSubmit = async (data: SettingsFormData) => {
    const token = localStorage.getItem("token");
    try {
      const [userResponse, profileResponse] = await Promise.all([
        fetch(`http://localhost:3333/users/${userDataId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...(data.email && { email: data.email }),
            ...(data.username && { username: data.username }),
          }),
        }),
        fetch(`http://localhost:3333/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...(data.bio && { bio: data.bio }),
            ...(data.hobbies && {
              hobbies: data.hobbies.map((hobby) => hobby.value),
            }),
          }),
        }),
      ]);

      if (userResponse.ok && profileResponse.ok) {
        toast({
          title: "Success",
          description: "User information updated successfully",
        });
        router.push("/dashboard");
      } else {
        const errorData = await userResponse.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update user information",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
        <CardDescription>
          Update your account information and profile. All fields are optional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  {...register("username")}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hobbies">Hobbies</Label>
                <div className="flex flex-wrap gap-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center">
                      <Input
                        {...register(`hobbies.${index}.value`)}
                        placeholder="Enter a hobby"
                        className="w-32"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="ml-2"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ value: "" })}
                    disabled={fields.length >= 20}
                  >
                    Add Hobby
                  </Button>
                </div>
                {errors.hobbies && (
                  <p className="text-red-500 text-sm">
                    {errors.hobbies.message}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Select your preferred theme
              </span>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update User Information"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
