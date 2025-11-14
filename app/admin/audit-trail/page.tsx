"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AuditLog {
  id: string
  action: string
  entity: string
  entityId: string
  details: string
  user: string
  timestamp: string
  changes: Record<string, unknown>
}

export default function AuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/audit-trail")
      const result = await response.json()

      if (result.success) {
        setAuditLogs(result.data)
      } else {
        setError("Failed to fetch audit logs")
      }
    } catch (err) {
      setError("Error fetching audit logs")
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      case "ARCHIVE":
        return "bg-yellow-100 text-yellow-800"
      case "RESTORE":
        return "bg-purple-100 text-purple-800"
      case "LOGIN":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Trail</h1>
        <p className="text-muted-foreground mt-2">Complete history of all system changes and actions</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            {auditLogs.length} log{auditLogs.length !== 1 ? "s" : ""} recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No audit logs</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{log.entity}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="text-sm">{formatTimestamp(log.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
