"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, Users, TrendingUp, CheckCircle } from "lucide-react"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    completedEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
  })
  const [eventData, setEventData] = useState<any[]>([])
  const [eventTypeData, setEventTypeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await fetch("/api/events")
      const events = eventsRes.ok ? (await eventsRes.json()).data : []

      // Calculate stats
      const totalEvents = events.length
      const completedEvents = events.filter((e: any) => e.status === "Completed").length
      const pendingEvents = events.filter((e: any) => e.status === "Pending").length
      const approvedEvents = events.filter((e: any) => e.status === "Approved").length

      setStats({
        totalEvents,
        completedEvents,
        pendingEvents,
        approvedEvents,
      })

      // Mock chart data for now - in real app, you'd aggregate by month
      setEventData([
        { month: "Jan", events: Math.floor(totalEvents * 0.2) },
        { month: "Feb", events: Math.floor(totalEvents * 0.25) },
        { month: "Mar", events: Math.floor(totalEvents * 0.3) },
        { month: "Apr", events: Math.floor(totalEvents * 0.15) },
        { month: "May", events: Math.floor(totalEvents * 0.1) },
      ])

      // Event types distribution
      const typeCounts = events.reduce((acc: any, event: any) => {
        const type = event.type || "Other"
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})

      const total = Object.values(typeCounts).reduce((sum: any, count: any) => sum + count, 0) as number
      const typeData = Object.entries(typeCounts).map(([name, count]: [string, any]) => ({
        name,
        value: Math.round((count / total) * 100),
      }))

      setEventTypeData(typeData.length > 0 ? typeData : [
        { name: "Conferences", value: 35 },
        { name: "Webinars", value: 25 },
        { name: "Workshops", value: 20 },
        { name: "Networking", value: 20 },
      ])
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <>
      <style jsx global>{`
        body {
          background: #ffe4f0 !important;
          font-family: 'Georgia', serif;
          color: #6d4c5c;
        }

        .dashboard-container {
          min-height: 100vh;
          background: #ffe4f0;
          padding: 2rem;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #ff69b4;
          text-align: center;
          margin-bottom: 1rem;
        }

        .dashboard-subtitle {
          font-size: 1.1rem;
          color: #8b4f6f;
          text-align: center;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #ffffff;
          border: 2px solid #ffb6c1;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(255, 105, 180, 0.2);
          transition: border-color 0.3s ease;
        }

        .stat-card:hover {
          border-color: #ff69b4;
        }

        .stat-title {
          font-size: 1rem;
          font-weight: 600;
          color: #6d4c5c;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ff69b4;
          margin-bottom: 0.5rem;
        }

        .stat-desc {
          font-size: 0.9rem;
          color: #8b4f6f;
        }

        .chart-card {
          background: #ffffff;
          border: 2px solid #ffb6c1;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(255, 105, 180, 0.2);
          margin-bottom: 2rem;
        }

        .chart-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ff69b4;
          text-align: center;
          margin-bottom: 1rem;
        }

        .chart-subtitle {
          font-size: 0.9rem;
          color: #8b4f6f;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .dashboard-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 2rem;
          }

          .dashboard-container {
            padding: 1rem;
          }

          .stat-card,
          .chart-card {
            padding: 1rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .dashboard-charts {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="floral-dash-1"></div>
        <div className="floral-dash-2"></div>
        <div className="floral-dash-3"></div>
        <div className="floral-dash-4"></div>

        <div>
          <h1 className="dashboard-title">Baby Shower Dashboard</h1>
          <p className="dashboard-subtitle">Celebration Management Center</p>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-title">
              <Calendar size={24} />
              Total Events
            </div>
            <div className="stat-value">{stats.totalEvents}</div>
            <p className="stat-desc">Events in the system</p>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              <CheckCircle size={24} />
              Completed Events
            </div>
            <div className="stat-value">{stats.completedEvents}</div>
            <p className="stat-desc">Successfully completed celebrations</p>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              <Users size={24} />
              Pending Approvals
            </div>
            <div className="stat-value">{stats.pendingEvents}</div>
            <p className="stat-desc">Events awaiting approval</p>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              <TrendingUp size={24} />
              Approved Events
            </div>
            <div className="stat-value">{stats.approvedEvents}</div>
            <p className="stat-desc">Events ready for celebration</p>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-card">
            <h3 className="chart-title">Event Analytics</h3>
            <p className="chart-subtitle">Monthly Event Trends</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 105, 180, 0.2)" />
                <XAxis dataKey="month" stroke="#6d4c5c" fontWeight="600" />
                <YAxis stroke="#6d4c5c" fontWeight="600" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 105, 180, 0.3)',
                    borderRadius: '12px',
                    fontWeight: '600',
                    color: '#6d4c5c',
                    boxShadow: '0 4px 15px rgba(255, 105, 180, 0.2)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="events" stroke="#ff69b4" strokeWidth={4} name="Events" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Celebration Types</h3>
            <p className="chart-subtitle">Event Categories</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="rgba(255, 105, 180, 0.3)"
                  strokeWidth={2}
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#ff69b4', '#ffb6c1', '#ffe4f0', '#ff1493'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 105, 180, 0.3)',
                    borderRadius: '12px',
                    fontWeight: '600',
                    color: '#6d4c5c',
                    boxShadow: '0 4px 15px rgba(255, 105, 180, 0.2)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Monthly Events</h3>
          <p className="chart-subtitle">Event Creation Trends</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 105, 180, 0.2)" />
              <XAxis dataKey="month" stroke="#6d4c5c" fontWeight="600" />
              <YAxis stroke="#6d4c5c" fontWeight="600" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 105, 180, 0.3)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  color: '#6d4c5c',
                  boxShadow: '0 4px 15px rgba(255, 105, 180, 0.2)'
                }}
              />
              <Bar dataKey="events" fill="#ff69b4" stroke="#ff69b4" strokeWidth={1} name="Events" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
