import { Link } from 'react-router-dom'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRateLimit } from '@/contexts/RateLimitContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import RateLimitGauge from '@/components/persona/RateLimitGauge'

const UserMenu = () => {
  const { user, logout } = useAuth()
  const { status } = useRateLimit()

  if (!user) return null

  const exhausted = !!status && !status.unlimited && status.remaining <= 0
  const showGauge = !!status && !status.unlimited

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-4 flex items-center gap-1 rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring">
        <div className="relative">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 font-display font-bold text-primary">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {exhausted && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={12} className="w-60">
        <DropdownMenuLabel className="flex items-baseline gap-1.5 pb-1">
          <span className="text-xs font-normal text-muted-foreground">Signed in as</span>
          <span className="font-display text-base font-bold text-primary">{user.username}</span>
        </DropdownMenuLabel>
        {showGauge && (
          <div className="px-2 pb-1.5">
            <RateLimitGauge label="daily creations left" />
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
