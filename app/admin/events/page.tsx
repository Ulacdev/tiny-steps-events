"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, MapPin, Users, Clock, Edit2, Trash2 } from "lucide-react"
import { CreateEventModal } from "@/components/admin/create-event-modal"
import { DeleteDialog } from "@/components/admin/delete-dialog"

interface Event {
  id: string
  name: string
  date: string
  time: string
  location: string
  attendees: number
  status: "Upcoming" | "Ongoing" | "Completed" | "Pending"
  createdAt: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    fetchEvents()
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Refetch events when page becomes visible (after restore)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchEvents()
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEvent = async (eventData: Omit<Event, "id" | "createdAt">) => {
    try {
      if (editingEvent) {
        const response = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eventData, id: editingEvent.id }),
        })
        const updated = await response.json()
        setEvents(events.map((e) => (e.id === updated.id ? updated : e)))
      } else {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })
        const newEvent = await response.json()
        setEvents([newEvent, ...events])
      }
      setIsModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error("Failed to save event:", error)
    }
  }

  const handleDeleteEvent = async () => {
    if (!deletingEventId) return
    try {
      await fetch(`/api/events?id=${deletingEventId}`, { method: "DELETE" })
      setEvents(events.filter((e) => e.id !== deletingEventId))
      setIsDeleteOpen(false)
      setDeletingEventId(null)
    } catch (error) {
      console.error("Failed to delete event:", error)
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

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800"
      case "Ongoing":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading events...</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Create and manage all your events</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full md:w-auto">
          <Plus size={20} />
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden sm:inline">Total Events</span>
              <span className="sm:hidden">Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
              <Clock size={16} />
              <span className="hidden sm:inline">Upcoming</span>
              <span className="sm:hidden">Up</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{events.filter((e) => e.status === "Upcoming").length}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Attendees</span>
              <span className="sm:hidden">Att</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {(events.reduce((sum, e) => sum + e.attendees, 0) / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
              <MapPin size={16} />
              <span className="hidden sm:inline">Locations</span>
              <span className="sm:hidden">Loc</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{new Set(events.map((e) => e.location)).size}</div>
            <p className="text-xs text-muted-foreground">Venues</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Manage and track all your events</CardDescription>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{event.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(event.status)}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Date & Time</p>
                      <p className="font-medium">
                        {event.date} {event.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Attendees</p>
                      <p className="font-medium">{event.attendees}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(event)} className="flex-1 gap-1">
                      <Edit2 size={14} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDeleteDialog(event.id)}
                      className="flex-1 gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{event.date}</div>
                          <div className="text-xs text-muted-foreground">{event.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.attendees.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => openEditModal(event)} className="gap-1">
                            <Edit2 size={16} />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteDialog(event.id)}
                            className="gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                            Delete
                          </Button>
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

      <CreateEventModal isOpen={isModalOpen} onClose={closeModal} onAdd={handleAddEvent} editingEvent={editingEvent} />
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  )
}
