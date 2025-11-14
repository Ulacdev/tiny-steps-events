"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/admin/header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const auth = localStorage.getItem("isAuthenticated")
      const userRole = localStorage.getItem("userRole")
      const userEmail = localStorage.getItem("userEmail")

      if (!auth || userRole !== "admin" || !userEmail) {
        router.push("/")
        return
      }

      // Verify admin user exists and is active
      try {
        const response = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, verifyOnly: true })
        })

        if (!response.ok) {
          localStorage.clear()
          router.push("/")
          return
        }

        const data = await response.json()
        if (!data.success) {
          localStorage.clear()
          router.push("/")
          return
        }

        setIsAuthenticated(true)

        // Log login
        fetch("/api/audit-trail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "LOGIN",
            entity: "Admin",
            entityId: "admin-session",
            details: "Admin logged into the system",
            user: userEmail,
            changes: {},
          }),
        }).catch(() => {})

      } catch (error) {
        console.error('Auth verification failed:', error)
        localStorage.clear()
        router.push("/")
        return
      }
    }

    checkAuth()

    // Handle responsive behavior with JavaScript
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      if (width < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [router])

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4f0 100%)',
        fontFamily: 'Georgia, serif',
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#6d4c5c',
        textAlign: 'center'
      }}>
        Access Denied - Please log in to continue
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        body {
          font-family: 'Georgia', serif !important;
          background: linear-gradient(135deg, #fff0f5 0%, #ffe4f0 100%) !important;
        }
        .admin-layout {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff0f5 0%, #ffe4f0 100%);
          position: relative;
        }
        .admin-sidebar {
          background: rgba(255, 255, 255, 0.25) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15) !important;
        }
        .admin-header {
          background: rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 4px 20px rgba(255, 105, 180, 0.1) !important;
        }
        .admin-main {
          background: transparent !important;
          position: relative;
          z-index: 1;
        }
        /* Professional admin theme matching landing page */
        .admin-card {
          background: rgba(255, 255, 255, 0.25) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 20px !important;
          box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15) !important;
          transition: all 0.3s ease !important;
        }
        .admin-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 15px 40px rgba(255, 105, 180, 0.2) !important;
        }
        /* Enhanced Button Styles */
        .admin-btn {
          background: linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%) !important;
          color: #ffffff !important;
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 15px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px !important;
          text-transform: none !important;
          box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-family: 'Georgia', serif !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .admin-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .admin-btn:hover::before {
          left: 100%;
        }

        .admin-btn:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 10px 30px rgba(255, 105, 180, 0.5) !important;
          background: linear-gradient(135deg, #ff1493 0%, #ff69b4 100%) !important;
        }

        .admin-btn:active {
          transform: translateY(-1px) scale(0.98) !important;
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4) !important;
        }

        /* Secondary Button Variant */
        .admin-btn-secondary {
          background: rgba(255, 255, 255, 0.2) !important;
          color: #ff69b4 !important;
          border: 2px solid rgba(255, 105, 180, 0.3) !important;
          border-radius: 15px !important;
          font-weight: 600 !important;
          letter-spacing: 0.5px !important;
          text-transform: none !important;
          box-shadow: 0 4px 12px rgba(255, 105, 180, 0.2) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-family: 'Georgia', serif !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .admin-btn-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 105, 180, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .admin-btn-secondary:hover::before {
          left: 100%;
        }

        .admin-btn-secondary:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3) !important;
          background: rgba(255, 105, 180, 0.1) !important;
          color: #ff1493 !important;
        }

        /* Danger Button Variant */
        .admin-btn-danger {
          background: linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%) !important;
          color: #ffffff !important;
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 15px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px !important;
          text-transform: none !important;
          box-shadow: 0 6px 20px rgba(255, 68, 68, 0.4) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-family: 'Georgia', serif !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .admin-btn-danger:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 10px 30px rgba(255, 68, 68, 0.5) !important;
          background: linear-gradient(135deg, #ff3333 0%, #ff5555 100%) !important;
        }
        .admin-title {
          font-family: 'Georgia', serif !important;
          font-weight: 600 !important;
          text-transform: none !important;
          letter-spacing: 0 !important;
          color: #ff69b4 !important;
        }
        .admin-text {
          font-family: 'Georgia', serif !important;
          font-weight: 400 !important;
          color: #6d4c5c !important;
        }
      `}</style>
      <div className="admin-layout flex h-screen">
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main content area */}
        <div className="admin-main flex-1 flex flex-col overflow-hidden">
          <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </>
  )
}
