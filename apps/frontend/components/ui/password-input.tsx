"use client"

import * as React from "react"
import { Eye, EyeOff } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordRequirements?: boolean;
}

export const PasswordRequirements = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSymbol: /[!@#$%^&*(),.?":{}|<>]/
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showPasswordRequirements = false, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [requirements, setRequirements] = React.useState({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSymbol: false
    })

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      
      // Update password requirements
      setRequirements({
        minLength: value.length >= PasswordRequirements.minLength,
        hasUpperCase: PasswordRequirements.hasUpperCase.test(value),
        hasLowerCase: PasswordRequirements.hasLowerCase.test(value),
        hasNumber: PasswordRequirements.hasNumber.test(value),
        hasSymbol: PasswordRequirements.hasSymbol.test(value)
      })

      // Call the original onChange handler
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            onChange={handlePasswordChange}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        {showPasswordRequirements && (
          <div className="text-sm space-y-2" aria-live="polite">
            <p className="font-medium text-muted-foreground">Password must contain:</p>
            <ul className="grid gap-1 text-sm">
              <RequirementItem
                met={requirements.minLength}
                text={`At least ${PasswordRequirements.minLength} characters`}
              />
              <RequirementItem
                met={requirements.hasUpperCase}
                text="At least one uppercase letter"
              />
              <RequirementItem
                met={requirements.hasLowerCase}
                text="At least one lowercase letter"
              />
              <RequirementItem
                met={requirements.hasNumber}
                text="At least one number"
              />
              <RequirementItem
                met={requirements.hasSymbol}
                text="At least one special character"
              />
            </ul>
          </div>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <li className={cn(
      "flex items-center gap-2",
      met ? "text-green-500 dark:text-green-400" : "text-muted-foreground"
    )}>
      <div className={cn(
        "h-1.5 w-1.5 rounded-full",
        met ? "bg-green-500 dark:bg-green-400" : "bg-muted-foreground"
      )} />
      {text}
    </li>
  )
}

