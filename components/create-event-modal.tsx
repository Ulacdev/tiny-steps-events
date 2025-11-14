"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface Event {
  id: string
  name: string
  date: string
  time: string
  location: string
  attendees: number
  status: "Upcoming" | "Ongoing" | "Completed"
}

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (event: Omit<Event, "id">) => void
  editingEvent?: Event | null
}

export function CreateEventModal({ isOpen, onClose, onAdd, editingEvent }: CreateEventModalProps) {
  const [formData, setFormData] = useState<Omit<Event, "id">>({
    name: editingEvent?.name || "",
    date: editingEvent?.date || "",
    time: editingEvent?.time || "09:00",
    location: editingEvent?.location || "",
    attendees: editingEvent?.attendees || 0,
    status: editingEvent?.status || "Upcoming",
  })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name,
        date: editingEvent.date,
        time: editingEvent.time,
        location: editingEvent.location,
        attendees: editingEvent.attendees,
        status: editingEvent.status,
      })
    }
  }, [editingEvent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.date && formData.location) {
      onAdd(formData)
      setFormData({ name: "", date: "", time: "09:00", location: "", attendees: 0, status: "Upcoming" })
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className={`fixed z-50 ${isMobile ? "inset-0 flex items-end" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4"}`}
      >
        <Card className={`w-full ${isMobile ? "rounded-t-2xl" : ""} p-4 md:p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">{editingEvent ? "Edit Event" : "Create New Event"}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-2">Event Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter event name"
                required
                className="text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
                required
                className="text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Attendees</label>
                <Input
                  type="number"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: Number.parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md text-sm text-base"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
