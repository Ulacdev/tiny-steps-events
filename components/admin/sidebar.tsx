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
        /* Enhanced Sidebar Animations */
        @keyframes sidebarPulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15); }
          50% { box-shadow: 0 8px 40px rgba(255, 105, 180, 0.25); }
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(3px); }
        }

        @keyframes menuItemSlide {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .sidebar-comic {
          background: rgba(255, 255, 255, 0.3) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border-right: 2px solid rgba(255, 105, 180, 0.2) !important;
          box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15) !important;
          font-family: 'Georgia', serif !important;
          position: relative !important;
          animation: sidebarPulse 6s ease-in-out infinite !important;
        }

        .sidebar-comic::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(255, 105, 180, 0.05) 0%, transparent 50%, rgba(255, 182, 193, 0.05) 100%);
          pointer-events: none;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 2px solid rgba(255, 105, 180, 0.2);
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 182, 193, 0.1));
          color: #ff69b4;
          position: relative;
          overflow: hidden;
        }

        .sidebar-header::before {
          content: '🌸';
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 1.5rem;
          opacity: 0.3;
          animation: iconBounce 3s ease-in-out infinite;
        }

        .sidebar-title {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: none;
          background: linear-gradient(135deg, #ff69b4, #ffb6c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 2;
        }

        .sidebar-nav {
          padding: 2rem 1rem;
          background: transparent;
          position: relative;
          z-index: 2;
        }

        .sidebar-menu-item {
          margin-bottom: 0.75rem;
          animation: menuItemSlide 0.6s ease-out both;
        }

        .sidebar-menu-item:nth-child(1) { animation-delay: 0.1s; }
        .sidebar-menu-item:nth-child(2) { animation-delay: 0.2s; }
        .sidebar-menu-item:nth-child(3) { animation-delay: 0.3s; }
        .sidebar-menu-item:nth-child(4) { animation-delay: 0.4s; }
        .sidebar-menu-item:nth-child(5) { animation-delay: 0.5s; }
        .sidebar-menu-item:nth-child(6) { animation-delay: 0.6s; }
        .sidebar-menu-item:nth-child(7) { animation-delay: 0.7s; }
        .sidebar-menu-item:nth-child(8) { animation-delay: 0.8s; }
        .sidebar-menu-item:nth-child(9) { animation-delay: 0.9s; }

        .sidebar-link {
          display: block;
          padding: 1.2rem 1.5rem;
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 105, 180, 0.2);
          border-radius: 15px;
          text-decoration: none;
          color: #6d4c5c;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 1rem;
          font-family: 'Georgia', serif;
          position: relative;
          overflow: hidden;
        }

        .sidebar-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 105, 180, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .sidebar-link:hover::before {
          left: 100%;
        }

        .sidebar-link:hover {
          transform: translateY(-3px) translateX(5px);
          background: rgba(255, 105, 180, 0.15);
          color: #ff69b4;
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3);
          border-color: rgba(255, 105, 180, 0.4);
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(255, 182, 193, 0.2));
          color: #ff69b4;
          border-color: rgba(255, 105, 180, 0.4);
          box-shadow: 0 6px 20px rgba(255, 105, 180, 0.3);
        }

        .sidebar-link.active::after {
          content: '✨';
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          animation: iconBounce 2s ease-in-out infinite;
        }

        .sidebar-icon {
          margin-right: 1rem;
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .sidebar-link:hover .sidebar-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .sidebar-logout {
          margin-top: 3rem;
          padding: 1.2rem 1.5rem;
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(255, 182, 193, 0.15));
          color: #ff69b4;
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 15px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 1rem;
          font-family: 'Georgia', serif;
          position: relative;
          overflow: hidden;
        }

        .sidebar-logout::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 105, 180, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .sidebar-logout:hover::before {
          left: 100%;
        }

        .sidebar-logout:hover {
          transform: translateY(-3px) translateX(5px);
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(255, 182, 193, 0.2));
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
          border-color: rgba(255, 105, 180, 0.5);
        }

        .sidebar-close {
          background: rgba(255, 255, 255, 0.3);
          border: 2px solid rgba(255, 105, 180, 0.3);
          color: #6d4c5c;
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .sidebar-close::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 105, 180, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .sidebar-close:hover::before {
          left: 100%;
        }

        .sidebar-close:hover {
          transform: translateY(-2px) scale(1.05);
          background: rgba(255, 105, 180, 0.15);
          box-shadow: 0 6px 20px rgba(255, 105, 180, 0.3);
        }

        /* Mobile Enhancements */
        @media (max-width: 768px) {
          .sidebar-comic {
            box-shadow: 0 0 50px rgba(255, 105, 180, 0.2);
          }

          .sidebar-header {
            padding: 1.5rem 1rem;
          }

          .sidebar-title {
            font-size: 1.3rem;
          }

          .sidebar-nav {
            padding: 1.5rem 0.5rem;
          }

          .sidebar-link {
            padding: 1rem;
            font-size: 0.9rem;
          }
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
