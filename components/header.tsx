"use client"

import { Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditProfileModal } from "./edit-profile-modal"

interface HeaderProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "Admin"
    setUserEmail(email)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/")
  }

  return (
    <>
      <header className="bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
            <Menu size={20} />
          </Button>
          <div className="text-sm text-muted-foreground">Event Management System</div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 hover:bg-muted">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold cursor-pointer">
                {userEmail.charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)} className="cursor-pointer">
              <User size={16} className="mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  )
}
