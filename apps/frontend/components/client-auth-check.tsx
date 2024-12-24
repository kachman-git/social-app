'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/types"
import { ReactNode } from "react"

interface ClientAuthCheckProps {
  fallback?: ReactNode
  children: ReactNode
}

export function ClientAuthCheck({ children, fallback }: ClientAuthCheckProps) {
  const { user } = useAuth()
  
  if (!user && fallback) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export function AuthButtons() {
  const { user } = useAuth()
  
  if (!user) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" asChild>
          <Link href="/signup">
            Get Started Securely
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/signin">
            Sign In
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" asChild>
      <Link href="/dashboard">
        Go to Dashboard
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  )
}

