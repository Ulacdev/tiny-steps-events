"use client"

import { useEffect } from 'react'

export default function DynamicTitle() {
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            // Set title
            if (data.data.systemTitle) {
              document.title = data.data.systemTitle
            }

            // Set favicon
            if (data.data.titleLogoUrl) {
              const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
              if (link) {
                link.href = data.data.titleLogoUrl
              } else {
                const newLink = document.createElement('link')
                newLink.rel = 'icon'
                newLink.href = data.data.titleLogoUrl
                document.head.appendChild(newLink)
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    loadSettings()

    // Refresh settings every 30 seconds to pick up changes
    const interval = setInterval(loadSettings, 30000)

    return () => clearInterval(interval)
  }, [])

  return null
}