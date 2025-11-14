"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RotateCcw, Trash2 } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

interface ArchivedEvent {
  id: string
  clientName: string
  contactNumber: string
  email: string
  eventTitle: string
  eventTheme: string
  packageType: string
  eventDate: string
  eventTime: string
  venue: string
  numberOfGuests: number
  paymentStatus: string
  totalAmount: number
  remarks: string
  eventStatus: string
  archivedAt: string
}

export default function ArchivePage() {
  const [archivedEvents, setArchivedEvents] = useState<ArchivedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    fetchArchivedEvents()

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const fetchArchivedEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/archive")
      const result = await response.json()

      if (result.success) {
        setArchivedEvents(result.data)
      } else {
        setError("Failed to fetch archived events")
      }
    } catch (err) {
      setError("Error fetching archived events")
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (event: ArchivedEvent) => {
    try {
      const createResponse = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: event.clientName,
          contactNumber: event.contactNumber,
          email: event.email,
          eventTitle: event.eventTitle,
          eventTheme: event.eventTheme,
          packageType: event.packageType,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          venue: event.venue,
          numberOfGuests: event.numberOfGuests,
          paymentStatus: event.paymentStatus,
          totalAmount: event.totalAmount,
          remarks: event.remarks,
          eventStatus: "Pending",
        }),
      })

      if (createResponse.ok) {
        const deleteResponse = await fetch(`/api/archive?id=${event.id}`, {
          method: "DELETE",
        })

        if (deleteResponse.ok) {
          await fetch("/api/audit-trail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "RESTORE",
              entity: "Event",
              entityId: event.id,
              details: `Restored booking: ${event.eventTitle} for ${event.clientName}`,
              user: "admin@eventmis.com",
              changes: {},
            }),
          })

          setArchivedEvents(archivedEvents.filter((e) => e.id !== event.id))
        }
      }
    } catch (err) {
      setError("Failed to restore event")
    }
  }

  const handleDelete = async (event: ArchivedEvent) => {
    try {
      const response = await fetch(`/api/archive?id=${event.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetch("/api/audit-trail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "DELETE",
            entity: "ArchivedEvent",
            entityId: event.id,
            details: `Permanently deleted archived booking: ${event.eventTitle} for ${event.clientName}`,
            user: "admin@eventmis.com",
            changes: event,
          }),
        })

        setArchivedEvents(archivedEvents.filter((e) => e.id !== event.id))
      } else {
        setError("Failed to delete archived event")
      }
    } catch (err) {
      setError("Failed to delete archived event")
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <Breadcrumb />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Archive Management</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Manage archived events and restore them if needed
        </p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Archived Events</CardTitle>
          <CardDescription>
            {archivedEvents.length} archived event{archivedEvents.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading archived events...</div>
          ) : archivedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No archived events</div>
          ) : isMobile ? (
            <div className="space-y-3">
              {archivedEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">{event.eventTitle}</h3>
                      <p className="text-xs text-muted-foreground">{event.clientName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Event Date</p>
                      <p className="font-medium">{new Date(event.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Venue</p>
                      <p className="font-medium">{event.venue}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Guests</p>
                      <p className="font-medium">{event.numberOfGuests}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium">₱{(event.totalAmount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment</p>
                      <p className="font-medium">{event.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Archived</p>
                      <p className="font-medium">{new Date(event.archivedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                          <RotateCcw size={14} />
                          Restore
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Restore Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to restore "{event.eventTitle}" to active events?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRestore(event)}>Restore</AlertDialogAction>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent text-red-600 hover:text-red-700">
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Archived Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to permanently delete "{event.eventTitle}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(event)} className="bg-red-600 hover:bg-red-700">Delete Permanently</AlertDialogAction>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Event Title</th>
                    <th className="text-left py-2 px-4">Client</th>
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Venue</th>
                    <th className="text-left py-2 px-4">Guests</th>
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Archived Date</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedEvents.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4 font-medium">{event.eventTitle}</td>
                      <td className="py-2 px-4">{event.clientName}</td>
                      <td className="py-2 px-4">{new Date(event.eventDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{event.venue}</td>
                      <td className="py-2 px-4">{event.numberOfGuests}</td>
                      <td className="py-2 px-4">₱{(event.totalAmount || 0).toLocaleString()}</td>
                      <td className="py-2 px-4">{new Date(event.archivedAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                                <RotateCcw size={14} />
                                Restore
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Restore Event</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to restore "{event.eventTitle}" for {event.clientName} to active events?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRestore(event)}>Restore</AlertDialogAction>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-1 bg-transparent text-red-600 hover:text-red-700">
                                <Trash2 size={14} />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Archived Event</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to permanently delete "{event.eventTitle}" for {event.clientName}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(event)} className="bg-red-600 hover:bg-red-700">Delete Permanently</AlertDialogAction>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
