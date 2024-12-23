'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { editUser } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must not exceed 50 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
}).refine(data => data.username || data.email, {
  message: "At least one field must be filled"
});

type UserFormValues = z.infer<typeof userFormSchema>

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  })

  async function onSubmit(data: UserFormValues) {
    setIsSaving(true)
    try {
      const updatedUser = await editUser({
        username: data.username !== user?.username ? data.username : undefined,
        email: data.email !== user?.email ? data.email : undefined,
      })
      updateUser(updatedUser)
      toast({
        description: "Settings updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update settings.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container max-w-2xl py-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Update your account information. Your email address is used for notifications and signing in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your email address is used for notifications and signing in.
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
                    'Save Changes'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

