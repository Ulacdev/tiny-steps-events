"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Archive,
  ChevronLeft,
  FileText,
  Users,
  Briefcase,
  DollarSign,
  Settings,
  MessageSquare,
  Activity,
} from "lucide-react"
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
    { href: "/admin/events", label: "Event Management", icon: Calendar },
    { href: "/admin/participants", label: "Participant Management", icon: Users },
    { href: "/admin/users", label: "User Management", icon: Briefcase },
    { href: "/admin/financial", label: "Financial Management", icon: DollarSign },
    { href: "/admin/reports", label: "Reports Management", icon: FileText },
    { href: "/admin/audit-trail", label: "Audit Trail", icon: Activity },
    { href: "/admin/archive", label: "Archive Management", icon: Archive },
    { href: "/admin/settings", label: "System Settings", icon: Settings },
    // { href: "/admin/messaging", label: "Notification / Messaging", icon: MessageSquare },
  ]

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  return (
    <>
      <aside
        className={`bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col ${isOpen ? "w-64" : "w-0"
          } ${isMobile ? "fixed left-0 top-0 h-full z-40" : "relative"}`}
      >
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <h1 className="text-xl font-bold">Event MIS</h1>
          {isMobile && (
            <button onClick={onToggle} className="p-1 hover:bg-sidebar-accent rounded">
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-3 text-sm" asChild>
                  <span>
                    <Icon size={18} />
                    {item.label}
                  </span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </aside>

      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={onToggle} />}
    </>
  )
}
