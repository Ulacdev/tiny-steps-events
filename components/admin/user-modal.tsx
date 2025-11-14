"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string
  username: string
  email: string
  password?: string
  role: "Admin" | "Staff"
  status: "Active" | "Inactive"
  createdAt: string
}

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (user: Omit<User, "id" | "createdAt">) => Promise<void>
  editingUser?: User | null
}

export function UserModal({ isOpen, onClose, onAdd, editingUser }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: editingUser?.name || "",
    username: editingUser?.username || "",
    email: editingUser?.email || "",
    password: "",
    role: editingUser?.role || "Staff",
    status: editingUser?.status || "Active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.username || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    // Require password for new users
    if (!editingUser && !formData.password) {
      alert("Password is required for new users")
      return
    }

    const user = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password || undefined, // Only include password if provided
      role: formData.role as "Admin" | "Staff",
      status: formData.status as "Active" | "Inactive",
    }

    onAdd(user)
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "Staff",
      status: "Active",
    })
    onClose()
  }

  const handleClose = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "Staff",
      status: "Active",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          <DialogDescription>
            {editingUser ? "Update the user details." : "Enter the details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
              required={!editingUser}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as "Admin" | "Staff" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "Active" | "Inactive" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? "Update" : "Add"} User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}