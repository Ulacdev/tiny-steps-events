"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Users, Shield, Edit2, Trash2, Eye, MoreVertical } from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { UserModal } from "@/components/admin/user-modal"
import { Breadcrumb } from "@/components/breadcrumb"

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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
    handleResize()
    window.addEventListener("resize", handleResize)

    // Close dropdown menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-menu') && !target.closest('button')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.classList.add('hidden')
        })
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/users")
      const result = await response.json()
      setUsers(result.data || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await fetch(`/api/users?id=${deletingId}`, { method: "DELETE" })
      setUsers(users.filter((u) => u.id !== deletingId))
      setIsDeleteOpen(false)
      setDeletingId(null)
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  const handleAddUser = async (userData: Omit<User, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/users", {
        method: editingUser ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser ? { ...userData, id: editingUser.id } : userData),
      })
      if (!response.ok) throw new Error("Failed to save user")
      const result = await response.json()
      if (editingUser) {
        setUsers(users.map((u) => (u.id === editingUser.id ? result.data : u)))
      } else {
        setUsers([result.data, ...users])
      }
      setIsModalOpen(false)
      setEditingUser(null)
    } catch (error) {
      console.error("Failed to save user:", error)
    }
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const openViewModal = (user: User) => {
    setViewingUser(user)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setViewingUser(null)
  }

  const getRoleColor = (role: string) => {
    return role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading users...</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage admin and staff accounts</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full md:w-auto">
          <Plus size={20} />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Total Users</span>
              <span className="sm:hidden">Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
              <Shield size={16} />
              <span className="hidden sm:inline">Admins</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{users.filter((u) => u.role === "Admin").length}</div>
            <p className="text-xs text-muted-foreground">Administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Active</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{users.filter((u) => u.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Online</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage system users and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{user.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">@{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${getStatusColor(user.status)}`}>{user.status}</span>
                  </div>
                  <div className="flex justify-end pt-2">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          const userId = (e.currentTarget as HTMLElement).getAttribute('data-user-id')
                          const menu = document.getElementById(`menu-${userId}`)

                          if (menu) {
                            // Close other menus first
                            document.querySelectorAll('.dropdown-menu').forEach(m => {
                              if (m !== menu) m.classList.add('hidden')
                            })

                            // Toggle this menu
                            menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
                          }
                        }}
                        data-user-id={user.id}
                      >
                        <MoreVertical size={14} />
                      </Button>
                      <div id={`menu-${user.id}`} className="dropdown-menu absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden min-w-[200px] py-2">
                        <div className="flex gap-1 px-2">
                          <button
                            onClick={() => {
                              document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                              openViewModal(user)
                            }}
                            className="flex-1 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => {
                              document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                              openEditModal(user)
                            }}
                            className="flex-1 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                              setDeletingId(user.id)
                              setIsDeleteOpen(true)
                            }}
                            className="flex-1 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              const userId = (e.currentTarget as HTMLElement).getAttribute('data-user-id')
                              const menu = document.getElementById(`menu-${userId}-desktop`)

                              if (menu) {
                                // Close other menus first
                                document.querySelectorAll('.dropdown-menu').forEach(m => {
                                  if (m !== menu) m.classList.add('hidden')
                                })

                                // Toggle this menu
                                menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
                              }
                            }}
                            data-user-id={user.id}
                          >
                            <MoreVertical size={16} />
                          </Button>
                          <div id={`menu-${user.id}-desktop`} className="dropdown-menu absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden min-w-[200px] py-2">
                            <div className="flex gap-1 px-2">
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  openViewModal(user)
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-1 transition-colors"
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  openEditModal(user)
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded flex items-center justify-center gap-1 transition-colors"
                              >
                                <Edit2 size={14} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  setDeletingId(user.id)
                                  setIsDeleteOpen(true)
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded flex items-center justify-center gap-1 transition-colors"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        description="Are you sure you want to delete this user?"
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAdd={handleAddUser}
        editingUser={editingUser}
      />

      {/* View User Modal */}
      {isViewModalOpen && viewingUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingUser.name}</h2>
                  <p className="text-gray-600 mt-1">@{viewingUser.username}</p>
                </div>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{viewingUser.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Username:</span>
                        <span className="font-medium">@{viewingUser.username}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{viewingUser.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Role:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(viewingUser.role)}`}>
                          {viewingUser.role}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingUser.status)}`}>
                          {viewingUser.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium text-sm">
                          {new Date(viewingUser.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={closeViewModal}>
                  Close
                </Button>
                <Button onClick={() => { closeViewModal(); openEditModal(viewingUser); }}>
                  Edit User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
