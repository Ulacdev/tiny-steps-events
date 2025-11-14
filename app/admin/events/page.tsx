"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, MapPin, Users, Clock, Edit2, Trash2, Globe, Eye, MoreVertical } from "lucide-react"
import { CreateEventModal } from "@/components/admin/create-event-modal"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { Breadcrumb } from "@/components/breadcrumb"

interface Event {
  id: string
  clientName: string
  contactNumber: string
  email: string
  eventTitle: string
  eventTheme: "Twinkle Star" | "Boho Baby" | "Teddy Bear"
  packageType: "Basic" | "Deluxe" | "Premium"
  eventDate: string
  eventTime: string
  venue: string
  numberOfGuests: number
  paymentStatus: "Pending" | "Paid" | "Partial"
  totalAmount: number
  remarks: string
  eventStatus: "Pending" | "Approved" | "Completed" | "Cancelled"
  gallery: string[]
  createdAt: string
}


export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
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

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const result = await response.json()
      setEvents(result.data || result)
    } catch (error) {
      console.error("Failed to fetch events:", error)
      setError("Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }



  const handleAddEvent = async (eventData: Omit<Event, "id" | "createdAt">) => {
    try {
      setError(null)
      if (editingEvent) {
        const response = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eventData, id: editingEvent.id }),
        })
        if (!response.ok) throw new Error("Failed to update event")
        const result = await response.json()
        const updated = result.data
        setEvents(events.map((e) => (e.id === updated.id ? updated : e)))
      } else {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })
        if (!response.ok) throw new Error("Failed to create event")
        const result = await response.json()
        const newEvent = result.data
        setEvents([newEvent, ...events])
      }
      setIsModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error("Failed to save event:", error)
      setError("Failed to save event")
    }
  }

  const handleDeleteEvent = async () => {
    if (!deletingEventId) return
    try {
      setError(null)
      const response = await fetch(`/api/events?id=${deletingEventId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete event")
      setEvents(events.filter((e) => e.id !== deletingEventId))
      setIsDeleteOpen(false)
      setDeletingEventId(null)
    } catch (error) {
      console.error("Failed to delete event:", error)
      setError("Failed to delete event")
    }
  }

  const openEditModal = (event: Event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const openDeleteDialog = (eventId: string) => {
    setDeletingEventId(eventId)
    setIsDeleteOpen(true)
  }

  const openViewModal = (event: Event) => {
    setViewingEvent(event)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setViewingEvent(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const getStatusColor = (status: string, event?: Event) => {
    switch (status) {
      case "Pending":
        // Highlight website bookings in pending status
        if (event && isWebsiteBooking(event)) {
          return "bg-orange-100 text-orange-800 border border-orange-300"
        }
        return "bg-yellow-100 text-yellow-800"
      case "Approved":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isWebsiteBooking = (event: Event) => {
    return event.remarks && event.remarks.includes("Submitted via website reservation form")
  }


  if (isLoading) {
    return <div className="text-center py-12">Loading events...</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <Breadcrumb />
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Event Bookings</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage baby shower event bookings and client reservations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full md:w-auto">
          <Plus size={20} />
          Add Booking
        </Button>
      </div>

      <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="hidden sm:inline">Total Bookings</span>
                  <span className="sm:hidden">Bookings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">All bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                  <Clock size={16} />
                  <span className="hidden sm:inline">Pending Approval</span>
                  <span className="sm:hidden">Pending</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{events.filter((e) => e.eventStatus === "Pending").length}</div>
                <p className="text-xs text-muted-foreground">
                  {events.filter((e) => e.eventStatus === "Pending" && isWebsiteBooking(e)).length > 0 && (
                    <span className="text-blue-600 font-medium">
                      {events.filter((e) => e.eventStatus === "Pending" && isWebsiteBooking(e)).length} from website
                    </span>
                  )}
                  {!events.filter((e) => e.eventStatus === "Pending" && isWebsiteBooking(e)).length && "Awaiting review"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                  <Users size={16} />
                  <span className="hidden sm:inline">Total Guests</span>
                  <span className="sm:hidden">Guests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{events.reduce((sum, e) => sum + e.numberOfGuests, 0)}</div>
                <p className="text-xs text-muted-foreground">Expected attendees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="hidden sm:inline">Total Revenue</span>
                  <span className="sm:hidden">Revenue</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">₱{events.reduce((sum, e) => sum + (Number(e.totalAmount) || 0), 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total earnings</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Manage and track all baby shower event bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{event.eventTitle}</h3>
                            {isWebsiteBooking(event) && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                                <Globe size={10} />
                                Website
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{event.clientName}</p>
                          <p className="text-xs text-muted-foreground">{event.email}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                              event.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                              event.paymentStatus === "Partial" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}
                          >
                            {event.paymentStatus}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(event.eventStatus, event)}`}
                          >
                            {event.eventStatus}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Theme & Package</p>
                          <p className="font-medium">{event.eventTheme} - {event.packageType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date & Time</p>
                          <p className="font-medium">
                            {new Date(event.eventDate).toLocaleDateString()} {event.eventTime}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Venue</p>
                          <p className="font-medium">{event.venue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Guests & Amount</p>
                          <p className="font-medium">{event.numberOfGuests} guests - ₱{Number(event.totalAmount || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              const eventId = (e.currentTarget as HTMLElement).getAttribute('data-event-id')
                              const menu = document.getElementById(`menu-${eventId}`)

                              if (menu) {
                                // Close other menus first
                                document.querySelectorAll('.dropdown-menu').forEach(m => {
                                  if (m !== menu) m.classList.add('hidden')
                                })

                                // Toggle this menu
                                menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
                              }
                            }}
                            data-event-id={event.id}
                          >
                            <MoreVertical size={14} />
                          </Button>
                          <div id={`menu-${event.id}`} className="dropdown-menu absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden min-w-[200px] py-2">
                            <div className="flex gap-1 px-2">
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  openViewModal(event)
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-1 transition-colors"
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  openEditModal(event)
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded flex items-center justify-center gap-1 transition-colors"
                              >
                                <Edit2 size={14} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  openDeleteDialog(event.id)
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
                        <TableHead>Client/Event</TableHead>
                        <TableHead>Theme/Package</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Venue/Guests</TableHead>
                        <TableHead>Payment/Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="font-medium">{event.clientName}</div>
                                  <div className="text-xs text-muted-foreground">{event.eventTitle}</div>
                                  <div className="text-xs text-muted-foreground">{event.email}</div>
                                </div>
                                {isWebsiteBooking(event) && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                                    <Globe size={10} />
                                    Website
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{event.eventTheme}</div>
                              <div className="text-xs text-muted-foreground">{event.packageType}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(event.eventDate).toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">{event.eventTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{event.venue}</div>
                              <div className="text-xs text-muted-foreground">{event.numberOfGuests} guests</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                event.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                                event.paymentStatus === "Partial" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {event.paymentStatus}
                              </span>
                              <div className="text-xs text-muted-foreground">₱{Number(event.totalAmount || 0).toLocaleString()}</div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.eventStatus, event)}`}>
                                {event.eventStatus}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const eventId = (e.currentTarget as HTMLElement).getAttribute('data-event-id')
                                  const menu = document.getElementById(`menu-${eventId}-desktop`)

                                  if (menu) {
                                    // Close other menus first
                                    document.querySelectorAll('.dropdown-menu').forEach(m => {
                                      if (m !== menu) m.classList.add('hidden')
                                    })

                                    // Toggle this menu
                                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
                                  }
                                }}
                                data-event-id={event.id}
                              >
                                <MoreVertical size={16} />
                              </Button>
                              <div id={`menu-${event.id}-desktop`} className="dropdown-menu absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden min-w-[200px] py-2">
                                <div className="flex gap-1 px-2">
                                  <button
                                    onClick={() => {
                                      document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                      openViewModal(event)
                                    }}
                                    className="flex-1 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-1 transition-colors"
                                  >
                                    <Eye size={14} />
                                    <span>View</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                      openEditModal(event)
                                    }}
                                    className="flex-1 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded flex items-center justify-center gap-1 transition-colors"
                                  >
                                    <Edit2 size={14} />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                      openDeleteDialog(event.id)
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
      </div>

      <CreateEventModal isOpen={isModalOpen} onClose={closeModal} onAdd={handleAddEvent} editingEvent={editingEvent} />
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />

      {/* View Event Modal */}
      {isViewModalOpen && viewingEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingEvent.eventTitle}</h2>
                  <p className="text-gray-600 mt-1">Client: {viewingEvent.clientName}</p>
                  {isWebsiteBooking(viewingEvent) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mt-2">
                      <Globe size={12} />
                      Website Booking
                    </span>
                  )}
                </div>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Theme:</span>
                        <span className="font-medium">{viewingEvent.eventTheme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span className="font-medium">{viewingEvent.packageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(viewingEvent.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{viewingEvent.eventTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{viewingEvent.numberOfGuests}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{viewingEvent.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{viewingEvent.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{viewingEvent.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Venue & Payment</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Venue:</span>
                        <span className="font-medium">{viewingEvent.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-green-600">₱{Number(viewingEvent.totalAmount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          viewingEvent.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                          viewingEvent.paymentStatus === "Partial" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {viewingEvent.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Event Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingEvent.eventStatus, viewingEvent)}`}>
                          {viewingEvent.eventStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {viewingEvent.remarks && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{viewingEvent.remarks}</p>
                    </div>
                  )}

                  {viewingEvent.gallery && viewingEvent.gallery.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Gallery</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {viewingEvent.gallery.map((image, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {index === 0 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Main</span>}
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <img src={image} alt={`Gallery ${index + 1}`} className="h-16 w-16 object-cover rounded border" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="max-w-xs truncate" title={image}>
                                    {image.substring(0, 50)}...
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={closeViewModal}>
                  Close
                </Button>
                <Button onClick={() => { closeViewModal(); openEditModal(viewingEvent); }}>
                  Edit Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
