import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  MessageSquare,
  UserPlus,
  Shield,
} from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Connect, Share, Engage with
            <span className="text-primary"> DevShare</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Join our thriving community of developers. Share your thoughts,
            learn from others, and build meaningful connections in the world of
            technology.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Shield className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is protected with industry-standard encryption and
                  security measures.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Users className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Connect with Others</h3>
                <p className="text-sm text-muted-foreground">
                  Build meaningful connections with developers who share your
                  interests.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <MessageSquare className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Engage in Discussions</h3>
                <p className="text-sm text-muted-foreground">
                  Share your knowledge and participate in meaningful technical
                  discussions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground max-w-[42rem]">
              Join thousands of developers who are already part of our growing
              community.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
