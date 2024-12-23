"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { UserNav } from "./user-nav";
import { PenSquare } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function SiteHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <PenSquare className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">DevShare</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {!user && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
            {user && <UserNav />}
          </nav>
        </div>
      </div>
    </header>
  );
}
