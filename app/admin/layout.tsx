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
          background: #ffe4f0 !important;
        }
        .admin-layout {
          min-height: 100vh;
          background: #ffe4f0;
        }
        .admin-sidebar {
          background: #ffb6c1 !important;
          border-right: 2px solid #ff69b4 !important;
        }
        .admin-header {
          background: #ffb6c1 !important;
          border-bottom: 2px solid #ff69b4 !important;
        }
        .admin-main {
          background: #ffe4f0 !important;
        }
        .admin-card {
          background: #ffffff !important;
          border: 2px solid #ffb6c1 !important;
          border-radius: 10px !important;
          box-shadow: 0 2px 8px rgba(255, 105, 180, 0.2) !important;
        }
        .admin-card:hover {
          border-color: #ff69b4 !important;
          box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3) !important;
        }
        .admin-btn {
          background: #ff69b4 !important;
          color: #ffffff !important;
          border: 2px solid #ff69b4 !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-family: 'Georgia', serif !important;
          transition: background-color 0.3s ease !important;
        }
        .admin-btn:hover {
          background: #ff1493 !important;
          border-color: #ff1493 !important;
        }
        .admin-btn-secondary {
          background: #ffffff !important;
          color: #ff69b4 !important;
          border: 2px solid #ff69b4 !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-family: 'Georgia', serif !important;
          transition: background-color 0.3s ease !important;
        }
        .admin-btn-secondary:hover {
          background: #ffe4f0 !important;
        }
        .admin-btn-danger {
          background: #ff4444 !important;
          color: #ffffff !important;
          border: 2px solid #ff4444 !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-family: 'Georgia', serif !important;
          transition: background-color 0.3s ease !important;
        }
        .admin-btn-danger:hover {
          background: #cc3333 !important;
          border-color: #cc3333 !important;
        }
        .admin-title {
          font-family: 'Georgia', serif !important;
          font-weight: 600 !important;
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
