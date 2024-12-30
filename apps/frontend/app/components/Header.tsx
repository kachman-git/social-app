"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, User, Settings, LogOut, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.sub);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserId(null);
    window.location.href = "/";
  };

  const NavItems = () => (
    <>
      {isLoggedIn ? (
        <>
          <Button
            variant="ghost"
            asChild
            className="w-full md:w-auto justify-center"
          >
            <Link href="/dashboard" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full md:w-auto justify-center"
          >
            <Link href={`/profile`} className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full md:w-auto justify-center"
          >
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full md:w-auto justify-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            asChild
            className="w-full md:w-auto justify-center"
          >
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild className="w-full md:w-auto justify-center">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            Social App
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-4 flex flex-col space-y-2">
            <NavItems />
          </div>
        </div>
      </nav>
    </header>
  );
}
