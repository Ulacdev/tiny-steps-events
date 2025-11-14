"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface FinancialModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (record: Omit<FinancialRecord, "id">) => void
  editingRecord?: FinancialRecord | null
}

export function FinancialModal({ isOpen, onClose, onAdd, editingRecord }: FinancialModalProps) {
  const [formData, setFormData] = useState<{
    type: "Income" | "Expense"
    eventName: string
    amount: string
    category: "Venue" | "Catering" | "Decorations" | "Photography" | "Transportation" | "Miscellaneous"
    status: "Pending" | "Paid" | "Received"
    date: string
    description: string
  }>({
    type: "Expense",
    eventName: "",
    amount: "",
    category: "Venue",
    status: "Pending",
    date: new Date().toISOString().split('T')[0],
    description: "",
  })

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        type: editingRecord.type,
        eventName: editingRecord.eventName,
        amount: editingRecord.amount.toString(),
        category: editingRecord.category,
        status: editingRecord.status,
        date: editingRecord.date,
        description: editingRecord.description,
      })
    } else {
      setFormData({
        type: "Expense",
        eventName: "",
        amount: "",
        category: "Venue",
        status: "Pending",
        date: new Date().toISOString().split('T')[0],
        description: "",
      })
    }
  }, [editingRecord, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.eventName || !formData.amount || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    const record = {
      type: formData.type as "Income" | "Expense",
      eventName: formData.eventName,
      amount: parseFloat(formData.amount),
      category: formData.category as "Venue" | "Catering" | "Decorations" | "Photography" | "Transportation" | "Miscellaneous",
      status: formData.status as "Pending" | "Paid" | "Received",
      date: formData.date,
      description: formData.description,
    }

    onAdd(record)
    setFormData({
      type: "Expense",
      eventName: "",
      amount: "",
      category: "Venue",
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      description: "",
    })
    onClose()
  }

  const handleClose = () => {
    setFormData({
      type: "Expense",
      eventName: "",
      amount: "",
      category: "Venue",
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      description: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingRecord ? "Edit Financial Record" : "Add Financial Record"}</DialogTitle>
          <DialogDescription>
            {editingRecord ? "Update the financial record details." : "Enter the details for the new financial record."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as "Income" | "Expense" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Event Name</label>
            <Input
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              placeholder="Enter event name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Venue">Venue</SelectItem>
                <SelectItem value="Catering">Catering</SelectItem>
                <SelectItem value="Decorations">Decorations</SelectItem>
                <SelectItem value="Photography">Photography</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description or notes"
              rows={3}
              className="w-full px-3 py-2 border rounded-md text-sm resize-vertical"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingRecord ? "Update" : "Add"} Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}