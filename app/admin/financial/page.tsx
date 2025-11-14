"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign, TrendingUp, TrendingDown, Edit2, Trash2, Eye, MoreVertical } from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { FinancialModal } from "@/components/admin/financial-modal"
import { Breadcrumb } from "@/components/breadcrumb"

interface FinancialRecord {
  id: string
  type: "Income" | "Expense"
  eventName: string
  amount: number
  category: "Venue" | "Catering" | "Decorations" | "Photography" | "Transportation" | "Miscellaneous"
  status: "Pending" | "Paid" | "Received"
  date: string
  description: string
}

export default function FinancialPage() {
  const [records, setRecords] = useState<FinancialRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "Expense" | "Income">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null)
  const [viewingRecord, setViewingRecord] = useState<FinancialRecord | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    fetchRecords()
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

  const fetchRecords = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/financial")
      const result = await response.json()
      setRecords(result.data || [])
    } catch (error) {
      console.error("Failed to fetch financial records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await fetch(`/api/financial?id=${deletingId}`, { method: "DELETE" })
      setRecords(records.filter((r) => r.id !== deletingId))
      setIsDeleteOpen(false)
      setDeletingId(null)
    } catch (error) {
      console.error("Failed to delete record:", error)
    }
  }

  const handleAddRecord = async (recordData: Omit<FinancialRecord, "id">) => {
    try {
      const response = await fetch("/api/financial", {
        method: editingRecord ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRecord ? { ...recordData, id: editingRecord.id } : recordData),
      })
      if (!response.ok) throw new Error("Failed to save record")
      const result = await response.json()
      if (editingRecord) {
        setRecords(records.map((r) => (r.id === editingRecord.id ? result.data : r)))
      } else {
        setRecords([result.data, ...records])
      }
      setIsModalOpen(false)
      setEditingRecord(null)
    } catch (error) {
      console.error("Failed to save record:", error)
    }
  }

  const openEditModal = (record: FinancialRecord) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRecord(null)
  }

  const openViewModal = (record: FinancialRecord) => {
    setViewingRecord(record)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setViewingRecord(null)
  }


  const filteredRecords = activeTab === "all" ? records : records.filter((r) => r.type === activeTab)

  const totalExpense = records.filter((r) => r.type === "Expense").reduce((sum, r) => sum + r.amount, 0)
  const totalIncome = records.filter((r) => r.type === "Income").reduce((sum, r) => sum + r.amount, 0)
  const netProfit = totalIncome - totalExpense

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Expense":
        return "bg-red-100 text-red-800"
      case "Income":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading financial data...</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Track budgets, expenses, and income</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full md:w-auto">
          <Plus size={20} />
          Add Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown size={16} />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₱{totalExpense.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp size={16} />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₱{totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign size={16} />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₱{netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
          <CardDescription>Manage all financial transactions</CardDescription>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["all", "Expense", "Income"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{record.eventName}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{record.category}</p>
                      <p className="text-xs text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getTypeColor(record.type)}`}
                      >
                        {record.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          record.status === "Paid" || record.status === "Received" ? "bg-green-100 text-green-800" :
                          record.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold">₱{record.amount.toLocaleString()}</div>
                  {record.description && (
                    <p className="text-xs text-muted-foreground">{record.description}</p>
                  )}
                  <div className="flex justify-end pt-2">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          const recordId = (e.currentTarget as HTMLElement).getAttribute('data-record-id')
                          const menu = document.getElementById(`menu-${recordId}`)

                          if (menu) {
                            // Close other menus first
                            document.querySelectorAll('.dropdown-menu').forEach(m => {
                              if (m !== menu) m.classList.add('hidden')
                            })

                            // Toggle this menu
                            menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
                          }
                        }}
                        data-record-id={record.id}
                      >
                        <MoreVertical size={14} />
                      </Button>
                      <div id={`menu-${record.id}`} className="dropdown-menu absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden min-w-[200px] py-2">
                        <div className="flex gap-1 px-2">
                          <button
                            onClick={() => {
                              document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                              openViewModal(record)
                            }}
                            className="flex-1 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => {
                              document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                              openEditModal(record)
                            }}
                            className="flex-1 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                              setDeletingId(record.id)
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
                    <TableHead>Event Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.eventName}</TableCell>
                      <TableCell>{record.category}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">₱{record.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === "Paid" || record.status === "Received" ? "bg-green-100 text-green-800" :
                          record.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              const recordId = (e.currentTarget as HTMLElement).getAttribute('data-record-id')
                              const menu = document.getElementById(`menu-${recordId}-desktop`)

                              if (menu) {
                                // Close other menus first
                                document.querySelectorAll('.dropdown-menu').forEach(m => {
                                  if (m !== menu) m.classList.add('hidden')
                                })

                                // Toggle this menu
                                menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
                              }
                            }}
                            data-record-id={record.id}
                          >
                            <MoreVertical size={16} />
                          </Button>
                          <div id={`menu-${record.id}-desktop`} className="dropdown-menu absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden min-w-[200px] py-2">
                            <div className="flex gap-1 px-2">
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  openViewModal(record)
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-1 transition-colors"
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  openEditModal(record)
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded flex items-center justify-center gap-1 transition-colors"
                              >
                                <Edit2 size={14} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'))
                                  setDeletingId(record.id)
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
        title="Delete Record"
        description="Are you sure you want to delete this financial record?"
      />

      <FinancialModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAdd={handleAddRecord}
        editingRecord={editingRecord}
      />

      {/* View Financial Record Modal */}
      {isViewModalOpen && viewingRecord && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingRecord.eventName}</h2>
                  <p className="text-gray-600 mt-1">{viewingRecord.type} Record</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Event Name:</span>
                        <span className="font-medium">{viewingRecord.eventName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Type:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(viewingRecord.type)}`}>
                          {viewingRecord.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{viewingRecord.category}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount:</span>
                        <span className={`font-bold text-lg ${viewingRecord.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                          ₱{viewingRecord.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          viewingRecord.status === "Paid" || viewingRecord.status === "Received" ? "bg-green-100 text-green-800" :
                          viewingRecord.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {viewingRecord.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(viewingRecord.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {viewingRecord.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-md">
                        {viewingRecord.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Generate and print receipt
                    const receiptWindow = window.open('', '_blank', 'width=600,height=800');
                    if (receiptWindow) {
                      receiptWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>Receipt - ${viewingRecord.eventName}</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 20px; background: white; }
                            .header { text-align: center; border-bottom: 2px solid #666; padding-bottom: 20px; margin-bottom: 20px; }
                            .receipt-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                            .company-info { font-size: 14px; color: #666; }
                            .details { margin: 20px 0; }
                            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 5px 0; border-bottom: 1px solid #eee; }
                            .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
                            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
                            @media print { body { margin: 0; } }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <div class="receipt-title">RECEIPT</div>
                            <div class="company-info">
                              Tiny Steps Event MIS<br>
                              Event Management System<br>
                              Date: ${new Date().toLocaleDateString()}
                            </div>
                          </div>

                          <div class="details">
                            <div class="detail-row">
                              <span>Receipt Number:</span>
                              <span>${viewingRecord.id.slice(-8).toUpperCase()}</span>
                            </div>
                            <div class="detail-row">
                              <span>Event Name:</span>
                              <span>${viewingRecord.eventName}</span>
                            </div>
                            <div class="detail-row">
                              <span>Type:</span>
                              <span>${viewingRecord.type}</span>
                            </div>
                            <div class="detail-row">
                              <span>Category:</span>
                              <span>${viewingRecord.category}</span>
                            </div>
                            <div class="detail-row">
                              <span>Transaction Date:</span>
                              <span>${new Date(viewingRecord.date).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-row">
                              <span>Status:</span>
                              <span>${viewingRecord.status}</span>
                            </div>
                            ${viewingRecord.description ? `
                            <div class="detail-row">
                              <span>Description:</span>
                              <span>${viewingRecord.description}</span>
                            </div>
                            ` : ''}
                          </div>

                          <div class="total">
                            <div class="detail-row" style="border: none; font-size: 20px;">
                              <span>${viewingRecord.type.toUpperCase()} AMOUNT:</span>
                              <span>₱${viewingRecord.amount.toLocaleString()}</span>
                            </div>
                          </div>

                          <div class="footer">
                            <p>Thank you for your business!</p>
                            <p>This receipt was generated on ${new Date().toLocaleString()}</p>
                          </div>
                        </body>
                        </html>
                      `);
                      receiptWindow.document.close();
                      receiptWindow.print();
                    }
                  }}
                  className="gap-2"
                >
                  🧾 Generate Receipt
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={closeViewModal}>
                    Close
                  </Button>
                  <Button onClick={() => { closeViewModal(); openEditModal(viewingRecord); }}>
                    Edit Record
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
