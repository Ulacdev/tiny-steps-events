"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

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

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (event: Omit<Event, "id" | "createdAt">) => void
  editingEvent?: Event | null
}

export function CreateEventModal({ isOpen, onClose, onAdd, editingEvent }: CreateEventModalProps) {
  const [formData, setFormData] = useState<Omit<Event, "id" | "createdAt">>({
    clientName: "",
    contactNumber: "",
    email: "",
    eventTitle: "",
    eventTheme: "Twinkle Star",
    packageType: "Basic",
    eventDate: "",
    eventTime: "10:00",
    venue: "",
    numberOfGuests: 50,
    paymentStatus: "Pending",
    totalAmount: 15000,
    remarks: "",
    eventStatus: "Pending",
    gallery: [],
  })

  // Update form data when editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        clientName: editingEvent.clientName || "",
        contactNumber: editingEvent.contactNumber || "",
        email: editingEvent.email || "",
        eventTitle: editingEvent.eventTitle || "",
        eventTheme: editingEvent.eventTheme,
        packageType: editingEvent.packageType,
        eventDate: editingEvent.eventDate || "",
        eventTime: editingEvent.eventTime || "10:00",
        venue: editingEvent.venue || "",
        numberOfGuests: editingEvent.numberOfGuests || 50,
        paymentStatus: editingEvent.paymentStatus,
        totalAmount: editingEvent.totalAmount || 15000,
        remarks: editingEvent.remarks || "",
        eventStatus: editingEvent.eventStatus,
        gallery: editingEvent.gallery || [],
      })
    } else {
      // Reset form for new event
      setFormData({
        clientName: "",
        contactNumber: "",
        email: "",
        eventTitle: "",
        eventTheme: "Twinkle Star",
        packageType: "Basic",
        eventDate: "",
        eventTime: "10:00",
        venue: "",
        numberOfGuests: 50,
        paymentStatus: "Pending",
        totalAmount: 15000,
        remarks: "",
        eventStatus: "Pending",
        gallery: [],
      })
    }
  }, [editingEvent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.clientName && formData.eventTitle && formData.eventDate && formData.venue) {
      onAdd(formData)
      setFormData({
        clientName: "",
        contactNumber: "",
        email: "",
        eventTitle: "",
        eventTheme: "Twinkle Star",
        packageType: "Basic",
        eventDate: "",
        eventTime: "10:00",
        venue: "",
        numberOfGuests: 50,
        paymentStatus: "Pending",
        totalAmount: 15000,
        remarks: "",
        eventStatus: "Pending",
        gallery: [],
      })
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{editingEvent ? "Edit Event" : "Create New Event"}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client Name</label>
                <Input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <Input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>

            {/* Event Details */}
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <Input
                type="text"
                value={formData.eventTitle}
                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Theme</label>
                <select
                  value={formData.eventTheme}
                  onChange={(e) => setFormData({ ...formData, eventTheme: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="Twinkle Star">Twinkle Star</option>
                  <option value="Boho Baby">Boho Baby</option>
                  <option value="Teddy Bear">Teddy Bear</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Package Type</label>
                <select
                  value={formData.packageType}
                  onChange={(e) => setFormData({ ...formData, packageType: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="Basic">Basic</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Date</label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Event Time</label>
                <Input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                />
              </div>
            </div>

            {/* Venue & Guests */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Venue</label>
                <Input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Enter venue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of Guests</label>
                <Input
                  type="number"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: Number.parseInt(e.target.value) || 50 })}
                  placeholder="50"
                  min="1"
                />
              </div>
            </div>

            {/* Payment & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Status</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Amount (₱)</label>
                <Input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: Number.parseFloat(e.target.value) || 15000 })}
                  placeholder="15000"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Status</label>
                <select
                  value={formData.eventStatus}
                  onChange={(e) => setFormData({ ...formData, eventStatus: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Enter any additional remarks or special requests"
                className="w-full px-3 py-2 border rounded-md text-sm min-h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Event Gallery</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const promises = files.map(file => {
                    return new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.readAsDataURL(file);
                    });
                  });
                  Promise.all(promises).then(images => {
                    setFormData({ ...formData, gallery: images });
                  });
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Upload multiple images for the event gallery (optional)</p>
              {formData.gallery && formData.gallery.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600">{formData.gallery.length} image(s) selected</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingEvent ? "Update Booking" : "Create Booking"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
