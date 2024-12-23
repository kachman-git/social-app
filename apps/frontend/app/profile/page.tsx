"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createProfile, editProfile, getProfiles } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  bio: z
    .string()
    .min(1, "Bio is required")
    .max(500, "Bio must not exceed 500 characters"),
  hobbies: z
    .string()
    .transform((str) =>
      str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .refine((arr) => arr.length > 0, {
      message: "At least one hobby is required",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: "",
      hobbies: [],
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profiles = await getProfiles();
        if (profiles && profiles.length > 0) {
          const userProfile = profiles[0]; // Assuming one profile per user
          setProfile(userProfile);
          form.reset({
            bio: userProfile.bio,
            hobbies: userProfile.hobbies.join(", "),
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load profile.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [form, toast]);

  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true);
    try {
      if (profile) {
        await editProfile(profile.id, {
          bio: data.bio,
          hobbies: data.hobbies,
        });
      } else {
        const newProfile = await createProfile({
          bio: data.bio,
          hobbies: data.hobbies,
        });
        setProfile(newProfile);
      }
      toast({
        description: `Profile ${profile ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Failed to ${profile ? "update" : "create"} profile.`,
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write a short bio about yourself. This will be displayed
                      on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hobbies</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Reading, Writing, Coding"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your hobbies separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
