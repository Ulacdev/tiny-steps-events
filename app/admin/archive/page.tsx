"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type ArchivedEvent = {
  id: string
  name: string
  date: string
  time: string
  location: string
  attendees: number
  status: string
  createdAt: string
  archivedAt: string
}

export default function ArchivePage() {
  const [events, setEvents] = useState<ArchivedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchArchive = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/events/archive")
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchive()
  }, [])

  const handleRestore = async (id: string) => {
    setRestoringId(id)
    try {
      const res = await fetch("/api/events/archive/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const result = await res.json().catch(() => null)
      console.log('[archive] restore response', res.status, result)
      // show success dialog only when API returns ok:true
      if (res.ok && result?.ok) {
        setShowSuccessDialog(true)
        setTimeout(() => {
          setShowSuccessDialog(false)
          router.push('/admin/events')
        }, 1200)
      } else {
        // show a toast with returned error (if any) for debugging
        const errMsg = result?.error || result?.detail || `Status ${res.status}`
        console.warn('[archive] restore failed:', errMsg)
        // keep behavior: no dialog on failure, but show a toast
        toast({ title: 'Restore failed', description: String(errMsg), variant: 'destructive' })
      }
    } catch (err: any) {
      // No message box on error
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <>
      <Dialog open={showSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Restored</DialogTitle>
          </DialogHeader>
          <div>The event has been restored successfully.</div>
        </DialogContent>
      </Dialog>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Archive</h1>
          <p className="text-muted-foreground mt-2">Manage archived events and historical data</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Archived Events</CardTitle>
            <CardDescription>View and manage all archived events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Archived At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">No archived events found.</TableCell>
                    </TableRow>
                  ) : (
                    events.map((event, index) => (
                      <TableRow key={`${event.id}-${event.archivedAt || index}`}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.status}</TableCell>
                        <TableCell>{new Date(event.archivedAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(event.id)}
                            disabled={restoringId === event.id}
                          >
                            {restoringId === event.id ? (
                              <span>
                                <svg className="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                                Restoring...
                              </span>
                            ) : "Restore"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
