"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Calendar, Users, UserCheck, DollarSign, FileText, Clock, Archive, Settings, LogOut, ChevronLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  isMobile: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, isMobile, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/users", label: "Users", icon: UserCheck },
    { href: "/admin/financial", label: "Financial", icon: DollarSign },
    { href: "/admin/reports", label: "Reports", icon: FileText },
    { href: "/admin/messaging", label: "Messaging", icon: Mail },
    { href: "/admin/audit-trail", label: "Audit Trail", icon: Clock },
    { href: "/admin/archive", label: "Archive", icon: Archive },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  return (
    <>
      <style jsx global>{`
        .sidebar-comic {
          background: #ffb6c1 !important;
          border-right: 2px solid #ff69b4 !important;
          font-family: 'Georgia', serif !important;
        }
        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 2px solid #ff69b4;
          background: #ff69b4;
          color: white;
        }
        .sidebar-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
        }
        .sidebar-nav {
          padding: 2rem 1rem;
          background: #ffb6c1;
        }
        .sidebar-menu-item {
          margin-bottom: 0.5rem;
        }
        .sidebar-link {
          display: block;
          padding: 1rem 1.5rem;
          background: #ffffff;
          border: 2px solid #ffb6c1;
          border-radius: 8px;
          text-decoration: none;
          color: #6d4c5c;
          font-weight: 500;
          font-family: 'Georgia', serif;
          transition: all 0.3s ease;
        }
        .sidebar-link:hover {
          background: #ffe4f0;
          border-color: #ff69b4;
          color: #ff69b4;
        }
        .sidebar-link.active {
          background: #ff69b4;
          color: white;
          border-color: #ff69b4;
        }
        .sidebar-icon {
          margin-right: 0.75rem;
          display: inline-block;
        }
        .sidebar-logout {
          margin-top: 2rem;
          padding: 1rem 1.5rem;
          background: #ff69b4;
          color: white;
          border: 2px solid #ff69b4;
          border-radius: 8px;
          font-weight: 500;
          font-family: 'Georgia', serif;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .sidebar-logout:hover {
          background: #ff1493;
        }
        .sidebar-close {
          background: #ffffff;
          border: 2px solid #ffb6c1;
          color: #6d4c5c;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .sidebar-close:hover {
          background: #ffe4f0;
        }
      `}</style>

      <aside
        className={`sidebar-comic transition-all duration-300 flex flex-col ${isOpen ? "w-80" : "w-0"
          } ${isMobile ? "fixed left-0 top-0 h-full z-40" : "relative"}`}
      >
        <div className="sidebar-header flex items-center justify-between">
          <h1 className="sidebar-title">EVENT MIS HQ</h1>
          {isMobile && (
            <button onClick={onToggle} className="sidebar-close">
              <ChevronLeft size={24} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <div key={item.href} className="sidebar-menu-item">
                <Link href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                  <Icon size={24} className="sidebar-icon" />
                  {item.label}
                </Link>
              </div>
            )
          })}

         
        </nav>
      </aside>

      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={onToggle} />}
    </>
  )
}
