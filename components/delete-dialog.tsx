"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, X } from "lucide-react"

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  isLoading?: boolean
}

export function DeleteDialog({ isOpen, onClose, onConfirm, title, description, isLoading }: DeleteDialogProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h2 className="text-lg font-bold">{title}</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">{description}</p>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
