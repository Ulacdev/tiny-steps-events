"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Mail, Send, Trash2, Reply, RefreshCw } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

interface Message {
  id: string
  recipient: string
  subject: string
  body: string
  type: "Inbox" | "Announcement"
  read: boolean
  createdAt: string
  parentId?: string
  replies?: Message[]
}

export default function MessagingPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<"Inbox" | "Announcement">("Inbox")
  const [isComposing, setIsComposing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [formData, setFormData] = useState({ recipient: "", subject: "", body: "" })
  const [replyData, setReplyData] = useState({ body: "" })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchMessages()
    handleResize()
    window.addEventListener("resize", handleResize)

    // Set up polling for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [])

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  const fetchMessages = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch("/api/messages")
      const result = await response.json()
      setMessages(result.data || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!formData.recipient || !formData.subject || !formData.body) {
      alert("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "Announcement" }),
      })
      const result = await response.json()
      setMessages([result.data, ...messages])
      setFormData({ recipient: "", subject: "", body: "" })
      setIsComposing(false)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleSendReply = async () => {
    if (!replyingTo || !replyData.body.trim()) {
      alert("Please enter a reply message")
      return
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: replyingTo.recipient,
          subject: `Re: ${replyingTo.subject}`,
          body: replyData.body,
          type: "Inbox",
          parentId: replyingTo.id,
        }),
      })
      const result = await response.json()
      setMessages([result.data, ...messages])
      setReplyData({ body: "" })
      setIsReplying(false)
      setReplyingTo(null)
    } catch (error) {
      console.error("Failed to send reply:", error)
    }
  }

  const handleReply = (message: Message) => {
    setReplyingTo(message)
    setReplyData({ body: "" })
    setIsReplying(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/messages?id=${id}`, { method: "DELETE" })
      setMessages(messages.filter((m) => m.id !== id))
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  const filteredMessages = messages.filter((m) => m.type === activeTab)

  if (isLoading) {
    return <div className="text-center py-12">Loading messages...</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notification & Messaging</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Send messages and announcements</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={fetchMessages} variant="outline" className="gap-2" disabled={isRefreshing}>
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={() => setIsComposing(true)} className="gap-2 flex-1 md:flex-none">
            <Plus size={20} />
            Compose Message
          </Button>
        </div>
      </div>

      {isComposing && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient</label>
              <Input
                placeholder="Enter recipient email or name"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Enter message subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                placeholder="Enter your message"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full px-3 py-2 border rounded-md min-h-32"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Button onClick={handleSendMessage} className="gap-2 flex-1 md:flex-none">
                <Send size={18} />
                Send
              </Button>
              <Button onClick={() => setIsComposing(false)} variant="outline" className="flex-1 md:flex-none">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isReplying && replyingTo && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Reply size={20} />
              Reply to: {replyingTo.subject}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Replying to {replyingTo.recipient}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-3 rounded border-l-4 border-blue-200">
              <p className="text-sm text-muted-foreground mb-2">Original message:</p>
              <p className="text-sm">{replyingTo.body}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Reply</label>
              <Textarea
                placeholder="Enter your reply message"
                value={replyData.body}
                onChange={(e) => setReplyData({ ...replyData, body: e.target.value })}
                className="min-h-24"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Button onClick={handleSendReply} className="gap-2 flex-1 md:flex-none">
                <Send size={18} />
                Send Reply
              </Button>
              <Button
                onClick={() => {
                  setIsReplying(false)
                  setReplyingTo(null)
                  setReplyData({ body: "" })
                }}
                variant="outline"
                className="flex-1 md:flex-none"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Messages</CardTitle>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["Inbox", "Announcement"].map((tab) => (
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
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail size={32} className="mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
            </div>
          ) : isMobile ? (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{message.subject}</h3>
                      <p className="text-xs text-muted-foreground">{message.recipient}</p>
                      <p className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleReply(message)} className="text-blue-600">
                        <Reply size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(message.id)} className="text-red-600">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.body}</p>
                  {message.replies && message.replies.length > 0 && (
                    <div className="ml-4 space-y-2 border-l-2 border-muted pl-4">
                      {message.replies.map((reply) => (
                        <div key={reply.id} className="bg-muted/50 rounded p-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className="text-xs font-medium text-blue-600">Reply</p>
                              <p className="text-xs text-muted-foreground">{new Date(reply.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="text-sm mt-1">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMessages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{message.subject}</h3>
                        {message.replies && message.replies.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {message.replies.length} replies
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{message.recipient}</p>
                      <p className="text-sm text-muted-foreground mt-1">{message.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(message.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleReply(message)} className="text-blue-600">
                        <Reply size={16} />
                        Reply
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(message.id)} className="text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  {message.replies && message.replies.length > 0 && (
                    <div className="ml-8 space-y-2 border-l-2 border-muted pl-4">
                      {message.replies.map((reply) => (
                        <div key={reply.id} className="bg-muted/50 rounded p-3">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div>
                              <p className="text-xs font-medium text-blue-600">Reply</p>
                              <p className="text-xs text-muted-foreground">{new Date(reply.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="text-sm">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
