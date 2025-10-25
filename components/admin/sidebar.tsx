"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Calendar, Clock, Archive, LogOut, ChevronLeft } from "lucide-react"
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
    { href: "/admin/audit-trail", label: "Audit Trail", icon: Clock },
    { href: "/admin/archive", label: "Archive", icon: Archive },
    
  ]

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  return (
    <>
      <aside
        className={`bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col ${
          isOpen ? "w-64" : "w-0"
        } ${isMobile ? "fixed left-0 top-0 h-full z-40" : "relative"}`}
      >
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <h1 className="text-xl font-bold">Event Management System</h1>
          {isMobile && (
            <button onClick={onToggle} className="p-1 hover:bg-sidebar-accent rounded">
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-3" asChild>
                  <span>
                    <Icon size={20} />
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
