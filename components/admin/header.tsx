"use client"

import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface HeaderProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [userImage, setUserImage] = useState<string | null>(null)

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "Admin"
    setUserEmail(email)
    const img = localStorage.getItem("userImage")
    setUserImage(img && img.length > 0 ? img : null)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/")
  }

  return (
    <header className="bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu size={20} />
        </Button>
        {/* Keep a small branding / title area on the left (you can replace with logo) */}
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">Welcomce Back Admin</div>
        </div>
      </div>

      {/* Account menu on the upper-right */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-accent/50">
              <Avatar>
                {userImage ? (
                  <img src={userImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <AvatarFallback>{userEmail.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium">{userEmail}</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end" className="w-48">
            <DropdownMenuLabel className="px-2">Account</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => router.push('/admin/account')}>My account</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} data-variant="destructive">
              <LogOut size={14} />
              <span className="ml-2">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
