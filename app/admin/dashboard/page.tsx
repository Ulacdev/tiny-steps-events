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
          background: linear-gradient(135deg, #fff0f5 0%, #ffe4f0 100%);
          font-family: 'Georgia', serif;
          color: #6d4c5c;
        }

        /* Baby Shower Theme Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-5px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }

        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff0f5 0%, #ffe4f0 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        /* Floral Background Elements */
        .dashboard-container::before {
          content: '🌸';
          position: absolute;
          top: 5%;
          left: 5%;
          font-size: 3rem;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .dashboard-container::after {
          content: '👶💕';
          position: absolute;
          bottom: 10%;
          right: 8%;
          font-size: 2.5rem;
          opacity: 0.1;
          animation: sparkle 4s ease-in-out infinite;
        }

        .floral-dash-1 {
          content: '🌹';
          position: absolute;
          top: 15%;
          right: 10%;
          font-size: 2rem;
          opacity: 0.12;
          animation: float 8s ease-in-out infinite reverse;
        }

        .floral-dash-2 {
          content: '🌷';
          position: absolute;
          bottom: 20%;
          left: 10%;
          font-size: 2.5rem;
          opacity: 0.1;
          animation: sparkle 5s ease-in-out infinite;
        }

        .floral-dash-3 {
          content: '🍼';
          position: absolute;
          top: 25%;
          left: 15%;
          font-size: 1.8rem;
          opacity: 0.08;
          animation: gentleFloat 7s ease-in-out infinite;
        }

        .floral-dash-4 {
          content: '🎀';
          position: absolute;
          bottom: 30%;
          right: 15%;
          font-size: 2.2rem;
          opacity: 0.12;
          animation: float 9s ease-in-out infinite;
        }

        .dashboard-title {
          font-size: 3.2rem;
          font-weight: 800;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #ff69b4, #ffb6c1, #ff1493, #ff69b4);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease-in-out infinite, fadeInUp 1s ease-out;
          text-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
          margin-bottom: 1rem;
          position: relative;
          text-align: center;
        }

        .dashboard-title::before {
          content: '👶';
          position: absolute;
          left: -70px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2.8rem;
          animation: gentleFloat 3s ease-in-out infinite, sparkle 2s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
        }

        .dashboard-title::after {
          content: '💕';
          position: absolute;
          right: -70px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2.8rem;
          animation: gentleFloat 3s ease-in-out infinite reverse, sparkle 2.5s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes sparkle {
          0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.8; }
          50% { transform: translateY(-50%) scale(1.2); opacity: 1; }
        }

        .dashboard-subtitle {
          font-size: 1.2rem;
          color: #8b4f6f;
          font-weight: 600;
          background: linear-gradient(135deg, #ffe4f0, #fff0f5);
          padding: 1rem 2rem;
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 15px;
          display: inline-block;
          margin: 0 auto 3rem;
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.1);
          text-align: center;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 3px solid rgba(255, 105, 180, 0.3);
          border-radius: 25px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 1.5s ease-out, cardGlow 4s ease-in-out infinite;
          cursor: pointer;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #ff69b4, #ffb6c1, #ff1493, #ff69b4);
          background-size: 300% 300%;
          animation: gradientRotate 6s ease-in-out infinite;
          border-radius: 28px;
          z-index: -1;
          opacity: 0.4;
        }

        .stat-card::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255, 105, 180, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.6s ease;
          z-index: -1;
        }

        .stat-card:hover::after {
          width: 300px;
          height: 300px;
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 45px rgba(255, 105, 180, 0.3);
          border-color: rgba(255, 105, 180, 0.5);
        }

        .stat-card:active {
          transform: translateY(-4px) scale(0.98);
          transition: all 0.1s ease;
        }

        @keyframes cardGlow {
          0%, 100% { box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15); }
          50% { box-shadow: 0 15px 40px rgba(255, 105, 180, 0.25); }
        }

        @keyframes gradientRotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .stat-title {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: #6d4c5c;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          text-transform: none;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 700;
          color: #ff69b4;
          text-shadow: 1px 1px 3px rgba(255, 105, 180, 0.2);
          margin-bottom: 0.5rem;
        }

        .stat-desc {
          font-size: 0.9rem;
          color: #8b4f6f;
          font-weight: 500;
          line-height: 1.4;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 3px solid rgba(255, 105, 180, 0.3);
          border-radius: 25px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15);
          position: relative;
          animation: fadeInUp 2s ease-out, chartGlow 5s ease-in-out infinite;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .chart-card::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #ff69b4, #ffb6c1, #ff1493, #ff69b4);
          background-size: 300% 300%;
          animation: gradientRotate 8s ease-in-out infinite;
          border-radius: 28px;
          z-index: -1;
          opacity: 0.4;
        }

        .chart-card:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 20px 45px rgba(255, 105, 180, 0.25);
          border-color: rgba(255, 105, 180, 0.5);
        }

        @keyframes chartGlow {
          0%, 100% { box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15); }
          50% { box-shadow: 0 15px 40px rgba(255, 105, 180, 0.25); }
        }

        .chart-title {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #ff69b4;
          text-shadow: 1px 1px 3px rgba(255, 105, 180, 0.2);
          margin-bottom: 0.5rem;
          text-align: center;
          text-transform: none;
        }

        .chart-subtitle {
          font-size: 1rem;
          color: #8b4f6f;
          font-weight: 600;
          background: linear-gradient(135deg, #ffe4f0, #fff0f5);
          padding: 0.5rem 1rem;
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 12px;
          display: inline-block;
          margin: 0 auto 2rem;
          text-align: center;
          box-shadow: 0 3px 10px rgba(255, 105, 180, 0.1);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .dashboard-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 2.2rem;
          }

          .dashboard-title::before,
          .dashboard-title::after {
            display: none;
          }

          .dashboard-container {
            padding: 1rem;
          }

          .stat-card,
          .chart-card {
            padding: 1.5rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .dashboard-charts {
            grid-template-columns: 1fr;
            gap: 2rem;
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
