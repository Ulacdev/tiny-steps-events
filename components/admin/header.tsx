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
        /* Enhanced Header Animations */
        @keyframes headerGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(255, 105, 180, 0.1); }
          50% { box-shadow: 0 4px 30px rgba(255, 105, 180, 0.2); }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-2px) rotate(1deg); }
          66% { transform: translateY(-4px) rotate(-1deg); }
        }

        @keyframes titleShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .header-comic {
          background: rgba(255, 255, 255, 0.25) !important;
          backdrop-filter: blur(15px) !important;
          -webkit-backdrop-filter: blur(15px) !important;
          border-bottom: 2px solid rgba(255, 105, 180, 0.2) !important;
          box-shadow: 0 4px 20px rgba(255, 105, 180, 0.1) !important;
          padding: 1.5rem 2rem !important;
          font-family: 'Georgia', serif !important;
          position: relative !important;
          animation: headerGlow 4s ease-in-out infinite !important;
        }

        .header-comic::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 105, 180, 0.05), transparent);
          animation: titleShimmer 3s ease-in-out infinite;
          pointer-events: none;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-menu-btn {
          background: rgba(255, 255, 255, 0.3) !important;
          border: 2px solid rgba(255, 105, 180, 0.3) !important;
          color: #6d4c5c !important;
          padding: 0.75rem !important;
          border-radius: 12px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .header-menu-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 105, 180, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .header-menu-btn:hover::before {
          left: 100%;
        }

        .header-menu-btn:hover {
          background: rgba(255, 105, 180, 0.15) !important;
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(255, 105, 180, 0.3) !important;
        }

        .header-logo {
          animation: logoFloat 4s ease-in-out infinite !important;
          transition: transform 0.3s ease !important;
        }

        .header-logo:hover {
          transform: scale(1.1) !important;
        }

        .header-title {
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: none;
          background: linear-gradient(135deg, #ff69b4, #ffb6c1, #ff69b4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .header-title::after {
          content: '✨';
          position: absolute;
          right: -25px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          animation: logoFloat 3s ease-in-out infinite reverse;
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
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 105, 180, 0.2);
          padding: 0.75rem 1.5rem;
          border-radius: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          color: #6d4c5c;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: none;
          position: relative;
          overflow: hidden;
        }

        .header-profile-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 105, 180, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .header-profile-btn:hover::before {
          left: 100%;
        }

        .header-profile-btn:hover {
          background: rgba(255, 105, 180, 0.1);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3);
        }

        .header-avatar {
          width: 45px;
          height: 45px;
          border: 3px solid rgba(255, 105, 180, 0.4);
          transition: all 0.3s ease;
        }

        .header-avatar:hover {
          border-color: #ff69b4;
          transform: scale(1.1);
        }

        .header-user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .header-user-name {
          font-size: 1rem;
          font-weight: 600;
          color: #6d4c5c;
          background: linear-gradient(135deg, #6d4c5c, #8b4f6f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-user-role {
          font-size: 0.8rem;
          font-weight: 500;
          color: #8b4f6f;
          opacity: 0.8;
        }

        .header-dropdown {
          background: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 2px solid rgba(255, 105, 180, 0.3) !important;
          box-shadow: 0 12px 40px rgba(255, 105, 180, 0.2) !important;
          border-radius: 15px !important;
          font-family: 'Georgia', serif !important;
          animation: fadeInUp 0.3s ease-out !important;
        }

        .header-dropdown-item {
          font-weight: 600 !important;
          letter-spacing: 0.5px !important;
          text-transform: none !important;
          color: #6d4c5c !important;
          border-radius: 10px !important;
          transition: all 0.3s ease !important;
          padding: 0.75rem 1rem !important;
        }

        .header-dropdown-item:hover {
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 182, 193, 0.1)) !important;
          color: #ff69b4 !important;
          transform: translateX(5px) !important;
        }

        .header-logout-item {
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 182, 193, 0.1)) !important;
          color: #ff69b4 !important;
          border-top: 2px solid rgba(255, 105, 180, 0.2) !important;
          margin-top: 0.5rem !important;
          padding-top: 1rem !important;
        }

        .header-logout-item:hover {
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(255, 182, 193, 0.15)) !important;
          color: #ff69b4 !important;
          transform: translateX(5px) !important;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Enhancements */
        @media (max-width: 768px) {
          .header-comic {
            padding: 1rem 1.5rem !important;
          }

          .header-title {
            font-size: 1.4rem;
          }

          .header-title::after {
            display: none;
          }

          .header-profile-btn {
            padding: 0.5rem 1rem;
          }

          .header-user-info {
            display: none;
          }
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
