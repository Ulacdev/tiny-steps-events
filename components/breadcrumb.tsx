"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

export function Breadcrumb() {
  const pathname = usePathname()

  const breadcrumbs = pathname
    .split("/")
    .filter((part) => part && part !== "admin")
    .map((part, index, arr) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
      href: `/admin/${arr.slice(0, index + 1).join("/")}`,
    }))

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-4 md:p-0">
      <Link href="/admin/dashboard" className="hover:text-foreground">
        Dashboard
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <ChevronRight size={16} />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
