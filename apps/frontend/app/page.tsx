import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  MessageSquare,
  UserPlus,
  Shield,
  Lock,
  UserCheck,
} from "lucide-react";
import { AuthButtons } from "@/components/client-auth-check";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function WelcomePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero Section */}
      <div className="container flex-1 items-center md:grid md:grid-cols-2 md:gap-6 lg:gap-12">
        <div className="relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="flex max-w-[980px] flex-col items-start gap-4">
            <div className="flex items-center rounded-full bg-muted px-4 py-1 text-sm">
              <Shield className="mr-2 h-4 w-4 text-primary" />
              Enterprise-grade security
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Connect, Share, Engage{" "}
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Securely
              </span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Join our community to share your thoughts, connect with
              like-minded people, and engage in meaningful conversations. All
              protected by industry-standard encryption.
            </p>
          </div>
          <AuthButtons />
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>End-to-end encryption for your data</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>ISO 27001 certified security</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>Advanced user verification</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="grid gap-6 lg:gap-8">
            <Card className="transform transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <FeatureCard
                  icon={Users}
                  title="Connect with Others"
                  description="Build meaningful connections with people who share your interests and passions."
                  gradient="from-blue-500 to-cyan-500"
                />
              </CardContent>
            </Card>
            <Card className="transform transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <FeatureCard
                  icon={MessageSquare}
                  title="Engage in Discussions"
                  description="Share your thoughts and participate in vibrant discussions on topics that matter to you."
                  gradient="from-purple-500 to-pink-500"
                />
              </CardContent>
            </Card>
            <Card className="transform transition-all duration-200 hover:scale-105">
              <CardContent className="p-6 mb-2">
                <FeatureCard
                  icon={UserPlus}
                  title="Grow Your Network"
                  description="Expand your professional and social network with like-minded individuals."
                  gradient="from-orange-500 to-red-500"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Security Features Section */}
      <div className="border-t bg-muted/50">
        <div className="container py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="col-span-full lg:col-span-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Enterprise-Grade Security
              </h2>
              <p className="mt-4 text-muted-foreground">
                Your security is our top priority. We implement the latest
                security measures to protect your data and privacy.
              </p>
            </div>
            <div className="col-span-full grid gap-4 lg:col-span-2 lg:grid-cols-2">
              <SecurityFeature
                title="End-to-End Encryption"
                description="All your data is encrypted using industry-standard protocols"
                icon={Lock}
              />
              <SecurityFeature
                title="Advanced Authentication"
                description="Multi-factor authentication and secure session management"
                icon={Shield}
              />
              <SecurityFeature
                title="Regular Security Audits"
                description="Continuous monitoring and security assessments"
                icon={UserCheck}
              />
              <SecurityFeature
                title="Data Protection"
                description="Compliant with GDPR and other privacy regulations"
                icon={Shield}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t">
        <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground">
              Join thousands of others who are already part of our secure
              community.
            </p>
          </div>
          <AuthButtons />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-80",
            gradient
          )}
        />
        <Icon className="relative h-6 w-6 ml-4" />
      </div>
      <div className="mt-4 space-y-2 p-4">
        <h3 className="font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function SecurityFeature({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
