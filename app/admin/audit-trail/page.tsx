"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const auditLogs = [
  {
    id: 1,
    action: "Created",
    entity: "User Account",
    details: "New user registered",
    timestamp: "2024-01-15 11:20 AM",
    user: "system",
  },
  {
    id: 2,
    action: "Modified",
    entity: "Settings",
    details: "Changed security policy",
    timestamp: "2024-01-15 10:15 AM",
    user: "admin@example.com",
  },
  {
    id: 3,
    action: "Deleted",
    entity: "Report",
    details: "Removed old report",
    timestamp: "2024-01-15 09:30 AM",
    user: "admin@example.com",
  },
  {
    id: 4,
    action: "Accessed",
    entity: "Database",
    details: "Query executed",
    timestamp: "2024-01-14 05:45 PM",
    user: "john@example.com",
  },
  {
    id: 5,
    action: "Modified",
    entity: "User Permissions",
    details: "Updated role access",
    timestamp: "2024-01-14 02:20 PM",
    user: "admin@example.com",
  },
]

export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Trail</h1>
        <p className="text-muted-foreground mt-2">Complete history of all system changes and actions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>Track all modifications and access to the system</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.entity}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
