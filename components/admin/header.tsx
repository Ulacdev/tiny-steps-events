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
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userImage, setUserImage] = useState<string | null>(null)
  const [systemTitle, setSystemTitle] = useState("Admin Dashboard")
  const [logoUrl, setLogoUrl] = useState<string>("")

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin"
    const email = localStorage.getItem("userEmail") || "admin@eventmis.com"
    setUserName(name)
    setUserEmail(email)
    const img = localStorage.getItem("userImage")
    setUserImage(img && img.length > 0 ? img : null)

    // Load system title and logo from settings
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setSystemTitle(data.data.systemTitle + " Admin")
            setLogoUrl(data.data.logoUrl || "")
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }
    loadSettings()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/")
  }

  return (
    <>
      <style jsx global>{`
        .header-comic {
          background: #ffb6c1 !important;
          border-bottom: 2px solid #ff69b4 !important;
          padding: 1.5rem 2rem !important;
          font-family: 'Georgia', serif !important;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .header-menu-btn {
          background: #ffffff !important;
          border: 2px solid #ffb6c1 !important;
          color: #6d4c5c !important;
          padding: 0.75rem !important;
          border-radius: 8px !important;
          transition: background-color 0.3s ease !important;
        }
        .header-menu-btn:hover {
          background: #ffe4f0 !important;
        }
        .header-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: white;
          text-transform: none;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .header-profile-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #ffffff;
          border: 2px solid #ffb6c1;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          transition: background-color 0.3s ease;
          cursor: pointer;
          color: #6d4c5c;
          font-weight: 500;
        }
        .header-profile-btn:hover {
          background: #ffe4f0;
        }
        .header-avatar {
          width: 40px;
          height: 40px;
          border: 2px solid #ff69b4;
        }
        .header-user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .header-user-name {
          font-size: 1rem;
          font-weight: 500;
          color: #6d4c5c;
        }
        .header-user-role {
          font-size: 0.8rem;
          font-weight: 400;
          color: #8b4f6f;
        }
        .header-dropdown {
          background: #ffffff !important;
          border: 2px solid #ffb6c1 !important;
          border-radius: 8px !important;
          font-family: 'Georgia', serif !important;
        }
        .header-dropdown-item {
          font-weight: 500 !important;
          color: #6d4c5c !important;
          border-radius: 4px !important;
        }
        .header-dropdown-item:hover {
          background: #ffe4f0 !important;
          color: #ff69b4 !important;
        }
        .header-logout-item {
          background: #ffe4f0 !important;
          color: #ff69b4 !important;
          border-top: 1px solid #ffb6c1 !important;
        }
        .header-logout-item:hover {
          background: #ffb6c1 !important;
          color: #ff69b4 !important;
        }
      `}</style>

      <header className="header-comic">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onToggleSidebar} className="header-menu-btn md:hidden">
              <Menu size={24} />
            </button>
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-12 w-12 mr-3 object-cover rounded-full border-2 border-pink-300 shadow-lg" />
            )}
            <div className="header-title">{systemTitle}</div>
          </div>

          <div className="header-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="header-profile-btn">
                  <Avatar className="header-avatar">
                    {userImage ? (
                      <img src={userImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <AvatarFallback className="bg-white text-black font-bold">
                        {userEmail.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="header-user-info hidden sm:flex">
                    <span className="header-user-name">{userName}</span>
                    <span className="header-user-role">Administrator</span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="bottom" align="end" className="header-dropdown w-64">
                <DropdownMenuLabel className="px-3 py-2 font-semibold text-gray-700 border-b border-gray-200">
                  Account Settings
                </DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => router.push('/admin/account')} className="header-dropdown-item">
                  My Account
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem onSelect={handleLogout} className="header-logout-item">
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}
