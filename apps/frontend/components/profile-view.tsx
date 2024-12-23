import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface ProfileViewProps {
  user: {
    username?: string
    email: string
  }
  profile: {
    bio: string
    hobbies: string[]
  }
}

export function ProfileView({ user, profile }: ProfileViewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {user.username?.[0] || user.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{user.username || 'Anonymous'}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Bio</h3>
          <p className="text-muted-foreground">{profile.bio}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Hobbies</h3>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby) => (
              <Badge key={hobby} variant="secondary">
                {hobby}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

