"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb } from "@/components/breadcrumb"

interface Transaction {
  id: string
  action: string
  entity: string
  entityId: string
  details: string
  user: string
  timestamp: string
  changes: Record<string, unknown>
}

interface ReportData {
  transactions: Transaction[]
  stats: {
    totalTransactions: number
    createCount: number
    updateCount: number
    deleteCount: number
    archiveCount: number
    restoreCount: number
    loginCount: number
  }
  byAction: Record<string, Transaction[]>
  byEntity: Record<string, Transaction[]>
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

const actionColors: Record<string, string> = {
  CREATE: "#10b981",
  UPDATE: "#3b82f6",
  DELETE: "#ef4444",
  ARCHIVE: "#f59e0b",
  RESTORE: "#8b5cf6",
  LOGIN: "#06b6d4",
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports")
        const result = await response.json()
        if (result.success) {
          setReportData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading reports...</div>
  }

  if (!reportData) {
    return <div className="flex items-center justify-center h-full">Failed to load reports</div>
  }

  const chartData = [
    { name: "Create", value: reportData.stats.createCount },
    { name: "Update", value: reportData.stats.updateCount },
    { name: "Delete", value: reportData.stats.deleteCount },
    { name: "Archive", value: reportData.stats.archiveCount },
    { name: "Restore", value: reportData.stats.restoreCount },
    { name: "Login", value: reportData.stats.loginCount },
  ].filter((item) => item.value > 0)

  const filteredTransactions = reportData.transactions.filter((t) => {
    // Action filter
    if (filter !== "all" && t.action !== filter) return false

    // Entity filter
    if (entityFilter !== "all" && t.entity !== entityFilter) return false

    // User filter
    if (userFilter !== "all" && t.user !== userFilter) return false

    // Date range filter
    const transactionDate = new Date(t.timestamp)
    if (dateFrom && transactionDate < new Date(dateFrom)) return false
    if (dateTo && transactionDate > new Date(dateTo + "T23:59:59")) return false

    return true
  })

  const handleExportCSV = () => {
    if (!reportData) return

    const headers = ["Action", "Entity", "Details", "User", "Timestamp"]
    const rows = filteredTransactions.map((t) => [
      t.action,
      t.entity,
      t.details,
      t.user,
      new Date(t.timestamp).toLocaleString(),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reports-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View all system transactions and activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All system activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Events Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.createCount}</div>
            <p className="text-xs text-muted-foreground">New events added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Events Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.archiveCount}</div>
            <p className="text-xs text-muted-foreground">Moved to archive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Updates Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.stats.updateCount}</div>
            <p className="text-xs text-muted-foreground">Event modifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Distribution</CardTitle>
            <CardDescription>Breakdown of all system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
            <CardDescription>Percentage of each transaction type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Filter transactions by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Action Type</label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {Object.keys(reportData?.byAction || {}).map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Entity Type</label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {Object.keys(reportData?.byEntity || {}).map((entity) => (
                    <SelectItem key={entity} value={entity}>
                      {entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">User</label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {Array.from(new Set(reportData?.transactions.map(t => t.user) || [])).map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="From"
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="To"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilter("all")
                setEntityFilter("all")
                setUserFilter("all")
                setDateFrom("")
                setDateTo("")
              }}
            >
              Clear Filters
            </Button>
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              Export Filtered Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
              <CardDescription>Complete transaction history with applied filters</CardDescription>
            </div>
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              Export to CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found matching the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Action</th>
                  <th className="text-left py-2 px-4">Entity</th>
                  <th className="text-left py-2 px-4">Details</th>
                  <th className="text-left py-2 px-4">User</th>
                  <th className="text-left py-2 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">
                      <Badge style={{ backgroundColor: actionColors[transaction.action] || "#6b7280" }}>
                        {transaction.action}
                      </Badge>
                    </td>
                    <td className="py-2 px-4">{transaction.entity}</td>
                    <td className="py-2 px-4">{transaction.details}</td>
                    <td className="py-2 px-4 text-xs">{transaction.user}</td>
                    <td className="py-2 px-4 text-xs">{new Date(transaction.timestamp).toLocaleString()}</td>
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
