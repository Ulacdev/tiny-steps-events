"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const storedEmail = localStorage.getItem("userEmail") || ""
      const storedUsername = localStorage.getItem("userName") || ""
      setEmail(storedEmail)
      setUsername(storedUsername)
      setError("")
      setSuccess("")
    }
  }, [isOpen])

  const handleSave = async () => {
    setError("")
    setSuccess("")

    // Validate current password
    if (!currentPassword) {
      setError("Current password is required")
      return
    }

    if (currentPassword !== "admin123") {
      setError("Current password is incorrect")
      return
    }

    // Validate new password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters")
        return
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match")
        return
      }
    }

    setLoading(true)

    try {
      // Update profile
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", username)

      if (newPassword) {
        // In a real app, this would be sent to backend
        localStorage.setItem("userPassword", newPassword)
      }

      setSuccess("Profile updated successfully!")
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your account information and password</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@eventmis.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-3">Change Password</h3>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
