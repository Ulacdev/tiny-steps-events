"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Download, Settings, Building, DollarSign, Bell, Globe } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    // System Settings
    systemTitle: "Tiny Steps Event MIS",
    systemEmail: "admin@eventmis.com",
    systemPhone: "+63 912 345 6789",
    currency: "PHP",

    // Business Information
    companyName: "Tiny Steps Events",
    companyAddress: "123 Event Street, Celebration City, Philippines",
    businessHours: "Mon-Fri: 9AM-6PM, Sat: 9AM-4PM",
    taxRate: "12",

    // Pricing Settings
    basePriceBasic: "15000",
    basePricePremium: "25000",
    basePriceDeluxe: "35000",
    additionalGuestFee: "500",

    // Notification Settings
    emailNotifications: true,
    reminderDays: "7",
    confirmationEmailTemplate: "Dear {clientName},\n\nYour event booking for {eventTitle} has been confirmed!\n\nEvent Details:\nDate: {eventDate}\nTime: {eventTime}\nVenue: {venue}\nGuests: {numberOfGuests}\n\nTotal Amount: ₱{totalAmount}\n\nThank you for choosing Tiny Steps Events!",

    // System Preferences
    maxGuestsPerEvent: "200",
    minAdvanceBookingDays: "30",

    // Landing Page Settings
    landingPageSubtitle: "Creating Magical Moments for Your Special Day",
    aboutUsTitle: "About Tiny Steps Events",
    aboutUsContent: "We specialize in creating unforgettable baby shower experiences with our themed packages designed to celebrate the joy of new beginnings. Our expert team ensures every detail is perfect for your special occasion.",
    contactEmail: "info@tinystepsevents.com",
    contactPhone: "+63 912 345 6789",
    logoUrl: "/placeholder.svg",
    titleLogoUrl: "/placeholder.svg",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [heroPreview, setHeroPreview] = useState<string>("")

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...result.data
          }))
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])


  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (response.ok) {
        alert("Settings saved successfully!")
        // Reload settings to reflect changes in UI
        await loadSettings()
      } else {
        alert("Failed to save settings")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackup = () => {
    const backupData = {
      settings,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }


  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setLogoPreview(base64)
        handleChange("logoUrl", base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTitleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setHeroPreview(base64)
        handleChange("titleLogoUrl", base64)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <Breadcrumb />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">Configure system preferences and backup</p>
      </div>


      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building size={20} />
            Business Information
          </CardTitle>
          <CardDescription>Company details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={settings.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">System Email</label>
              <Input
                type="email"
                value={settings.systemEmail}
                onChange={(e) => handleChange("systemEmail", e.target.value)}
                placeholder="Enter system email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company Address</label>
            <Textarea
              value={settings.companyAddress}
              onChange={(e) => handleChange("companyAddress", e.target.value)}
              placeholder="Enter company address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">System Phone</label>
              <Input
                value={settings.systemPhone}
                onChange={(e) => handleChange("systemPhone", e.target.value)}
                placeholder="Enter system phone"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Business Hours</label>
              <Input
                value={settings.businessHours}
                onChange={(e) => handleChange("businessHours", e.target.value)}
                placeholder="e.g., Mon-Fri: 9AM-6PM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tax Rate (%)</label>
            <Input
              type="number"
              value={settings.taxRate}
              onChange={(e) => handleChange("taxRate", e.target.value)}
              placeholder="Enter tax rate"
              min="0"
              max="100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} />
            Pricing Settings
          </CardTitle>
          <CardDescription>Configure base prices and fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Basic Package (₱)</label>
              <Input
                type="number"
                value={settings.basePriceBasic}
                onChange={(e) => handleChange("basePriceBasic", e.target.value)}
                placeholder="15000"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Premium Package (₱)</label>
              <Input
                type="number"
                value={settings.basePricePremium}
                onChange={(e) => handleChange("basePricePremium", e.target.value)}
                placeholder="25000"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deluxe Package (₱)</label>
              <Input
                type="number"
                value={settings.basePriceDeluxe}
                onChange={(e) => handleChange("basePriceDeluxe", e.target.value)}
                placeholder="35000"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Guest Fee (₱)</label>
              <Input
                type="number"
                value={settings.additionalGuestFee}
                onChange={(e) => handleChange("additionalGuestFee", e.target.value)}
                placeholder="500"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Advance Booking (days)</label>
              <Input
                type="number"
                value={settings.minAdvanceBookingDays}
                onChange={(e) => handleChange("minAdvanceBookingDays", e.target.value)}
                placeholder="30"
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Guests Per Event</label>
            <Input
              type="number"
              value={settings.maxGuestsPerEvent}
              onChange={(e) => handleChange("maxGuestsPerEvent", e.target.value)}
              placeholder="200"
              min="1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure email templates and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Notifications</label>
            <Select value={settings.emailNotifications ? "true" : "false"} onValueChange={(value) => handleChange("emailNotifications", value === "true")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reminder Days Before Event</label>
            <Input
              type="number"
              value={settings.reminderDays}
              onChange={(e) => handleChange("reminderDays", e.target.value)}
              placeholder="7"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmation Email Template</label>
            <Textarea
              value={settings.confirmationEmailTemplate}
              onChange={(e) => handleChange("confirmationEmailTemplate", e.target.value)}
              placeholder="Enter email template with placeholders like {clientName}, {eventTitle}, etc."
              rows={8}
            />
            <p className="text-xs text-muted-foreground">
              Available placeholders: {"{clientName}, {eventTitle}, {eventDate}, {eventTime}, {venue}, {numberOfGuests}, {totalAmount}"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Landing Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={20} />
            Landing Page Settings
          </CardTitle>
          <CardDescription>Configure homepage content and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">System Title</label>
              <Input
                value={settings.systemTitle}
                onChange={(e) => handleChange("systemTitle", e.target.value)}
                placeholder="Enter system title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Logo Upload</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {(logoPreview || settings.logoUrl) && (
                <div className="mt-2">
                  <img
                    src={logoPreview || settings.logoUrl}
                    alt="Logo preview"
                    className="w-16 h-16 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Landing Page Subtitle</label>
            <Input
              value={settings.landingPageSubtitle}
              onChange={(e) => handleChange("landingPageSubtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title Logo Upload</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleTitleLogoUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {(heroPreview || settings.titleLogoUrl) && (
              <div className="mt-2">
                <img
                  src={heroPreview || settings.titleLogoUrl}
                  alt="Title logo preview"
                  className="w-16 h-16 object-contain border rounded"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">About Us Title</label>
            <Input
              value={settings.aboutUsTitle}
              onChange={(e) => handleChange("aboutUsTitle", e.target.value)}
              placeholder="Enter about us section title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">About Us Content</label>
            <Textarea
              value={settings.aboutUsContent}
              onChange={(e) => handleChange("aboutUsContent", e.target.value)}
              placeholder="Enter about us content"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Email</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                placeholder="Enter contact email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Phone</label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                placeholder="Enter contact phone"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-3">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 flex-1 md:flex-none">
          <Save size={18} />
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
        <Button onClick={handleBackup} variant="outline" className="gap-2 flex-1 md:flex-none bg-transparent">
          <Download size={18} />
          Backup Database
        </Button>
      </div>

    </div>
  )
}
