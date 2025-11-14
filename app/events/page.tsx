"use client"

import { useState, useEffect } from "react"
import { PublicHeader } from "../../components/public-header"
import { PublicFooter } from "../../components/public-footer"

interface Event {
  id: string
  eventTitle: string
  eventDate: string
  eventTime?: string
  venue: string
  eventTheme: string
  numberOfGuests: number
  gallery?: string[]
  eventStatus: string
  clientName: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "past">("all")
  const [showSlideshow, setShowSlideshow] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, activeFilter])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/events')
      const result = await response.json()
      if (result.success) {
        setEvents(result.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    switch (activeFilter) {
      case "upcoming":
        filtered = events.filter(event => event.eventStatus === "Approved")
        break
      case "past":
        filtered = events.filter(event => event.eventStatus === "Completed")
        break
      default:
        filtered = events
    }

    setFilteredEvents(filtered)
  }

  const openSlideshow = (event: Event, imageIndex: number = 0) => {
    setCurrentEvent(event)
    setCurrentImageIndex(imageIndex)
    setShowSlideshow(true)
  }

  const closeSlideshow = () => {
    setShowSlideshow(false)
    setCurrentEvent(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (currentEvent && currentEvent.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % currentEvent.gallery!.length)
    }
  }

  const prevImage = () => {
    if (currentEvent && currentEvent.gallery) {
      setCurrentImageIndex((prev) => (prev - 1 + currentEvent.gallery!.length) % currentEvent.gallery!.length)
    }
  }

  if (isLoading) {
    return (
      <>
        <PublicHeader />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          background: 'linear-gradient(135deg, #fffdf6 0%, #fce4ec 25%, #e8f4fd 50%, #fffdf6 75%, #fce4ec 100%)',
          fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#2d2d2d'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👶</div>
            Loading magical moments...
          </div>
        </div>
        <PublicFooter />
      </>
    )
  }

  return (
    <>
      <PublicHeader />

      <style jsx>{`
        /* Hero Section */
        .events-hero {
          position: relative;
          width: 100vw;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          height: 70vh;
          min-height: 500px;
          overflow: hidden;
          margin-bottom: 0;
        }

        .events-hero-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .events-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8);
          transition: transform 0.5s ease;
        }

        .events-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(6, 6, 6, 0.2) 0%, rgba(163, 216, 255, 0.2) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .events-hero-content {
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 0 32px;
        }

        .events-hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
          letter-spacing: -1px;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .events-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
          line-height: 1.6;
          font-weight: 400;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Filter Buttons */
        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin: 48px 0;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: white;
          color: var(--pink-rose);
          padding: 12px 24px;
          border: 2px solid var(--pink-rose);
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--font-sans);
          text-transform: capitalize;
          box-shadow: 0 4px 12px rgba(255, 123, 180, 0.1);
        }

        .filter-btn:hover {
          background: var(--pink-rose);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 123, 180, 0.3);
        }

        .filter-btn.active {
          background: var(--pink-rose);
          color: white;
          box-shadow: 0 6px 16px rgba(255, 123, 180, 0.4);
        }

        /* Events Grid */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          margin-bottom: 80px;
        }

        .event-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 158, 207, 0.1);
          position: relative;
          cursor: pointer;
        }

        .event-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(255, 123, 180, 0.1);
        }

        .event-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .event-card:hover .event-image {
          transform: scale(1.08);
        }

        .event-status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 2;
        }

        .event-status-badge.upcoming {
          background: linear-gradient(135deg, #ff69b4, #ffb6c1);
          color: white;
        }

        .event-status-badge.past {
          background: linear-gradient(135deg, #6c757d, #495057);
          color: white;
        }

        .event-content {
          padding: 24px;
          background: transparent;
        }

        .event-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--charcoal);
          margin: 0 0 16px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .event-detail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--warm-gray);
          line-height: 1.4;
        }

        .detail-icon {
          font-size: 16px;
          min-width: 16px;
          color: var(--pink-rose);
        }

        .event-cta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 158, 207, 0.2);
        }

        .event-cta-btn {
          background: var(--pink-rose);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(255, 123, 180, 0.3);
        }

        .event-cta-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 141, 195, 0.4);
        }

        .event-cta-btn.secondary {
          background: var(--baby-blue);
          color: var(--charcoal);
          border: 1px solid var(--baby-blue);
        }

        .event-cta-btn.secondary:hover {
          background: rgba(163, 216, 255, 0.8);
          color: var(--charcoal);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 32px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(255, 182, 193, 0.15);
          border: 2px solid rgba(255, 182, 193, 0.1);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 12px;
        }

        .empty-text {
          color: var(--warm-gray);
          font-size: 16px;
        }

        /* Slideshow Modal */
        .slideshow-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-out;
        }

        .slideshow-modal-content {
          background: rgba(255, 250, 250, 0.98);
          border-radius: 20px;
          max-width: 95vw;
          width: 100%;
          max-height: 95vh;
          height: 95vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(255, 105, 180, 0.3);
          position: relative;
          animation: slideUp 0.3s ease-out;
        }

        .slideshow-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 105, 180, 0.1);
          border: none;
          font-size: 32px;
          color: #ff69b4;
          cursor: pointer;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .slideshow-close:hover {
          background: rgba(255, 105, 180, 0.2);
          transform: scale(1.1);
        }

        .slideshow-header {
          padding: 30px 40px 20px 40px;
          background: rgba(255, 255, 255, 0.95);
          border-bottom: 2px solid rgba(255, 182, 193, 0.2);
        }

        .slideshow-title {
          font-size: 32px;
          color: #ff69b4;
          margin: 0 0 20px 0;
          font-weight: 600;
          text-shadow: 1px 1px 2px rgba(255, 105, 180, 0.2);
        }

        .slideshow-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          color: #6d4c5c;
          font-size: 16px;
        }

        .slideshow-main {
          position: relative;
          height: calc(100% - 200px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .slideshow-image-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          max-height: 60vh;
          width: 100%;
          padding: 20px;
        }

        .slideshow-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .slideshow-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 105, 180, 0.9);
          color: white;
          border: none;
          font-size: 48px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
        }

        .slideshow-nav:hover {
          background: #ff69b4;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
        }

        .slideshow-prev {
          left: 20px;
        }

        .slideshow-next {
          right: 20px;
        }

        .slideshow-counter {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .slideshow-no-images {
          text-align: center;
          color: #8b4f6f;
        }

        .no-images-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .events-hero {
            height: 50vh;
            min-height: 350px;
          }

          .events-hero-content h1 {
            font-size: 32px;
          }

          .events-subtitle {
            font-size: 16px;
          }

          .events-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
          }

          .event-card {
            margin-bottom: 1rem;
          }

          .event-content {
            padding: 20px;
          }

          .event-title {
            font-size: 18px;
          }

          .event-detail {
            font-size: 12px;
          }

          .event-cta {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .event-cta-btn {
            justify-content: center;
            padding: 12px 16px;
          }

          .filter-buttons {
            flex-direction: column;
            align-items: center;
          }

          .event-status-badge {
            padding: 4px 8px;
            font-size: 0.7rem;
            top: 10px;
            right: 10px;
          }

          .slideshow-modal-content {
            max-width: 95vw;
            max-height: 95vh;
          }

          .slideshow-header {
            padding: 20px;
          }

          .slideshow-title {
            font-size: 24px;
          }

          .slideshow-details {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .slideshow-image-container {
            max-height: 50vh;
            padding: 10px;
          }

          .slideshow-nav {
            width: 50px;
            height: 50px;
            font-size: 36px;
          }

          .slideshow-counter {
            bottom: 80px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .events-hero {
            height: 40vh;
            min-height: 280px;
          }

          .events-hero-content h1 {
            font-size: 24px;
          }

          .events-subtitle {
            font-size: 14px;
          }

          .events-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .event-card {
            border-radius: 12px;
          }

          .event-image-container {
            height: 180px;
          }

          .event-content {
            padding: 16px;
          }

          .event-title {
            font-size: 16px;
            margin-bottom: 12px;
          }

          .event-details {
            gap: 8px;
            margin-bottom: 16px;
          }

          .event-detail {
            font-size: 0.8rem;
          }

          .event-cta {
            margin-top: 16px;
            padding-top: 12px;
          }

          .event-cta-btn {
            padding: 10px 14px;
            font-size: 0.8rem;
          }

          .event-status-badge {
            padding: 3px 6px;
            font-size: 0.6rem;
          }

          .slideshow-modal-content {
            max-width: 100vw;
            height: 100vh;
            border-radius: 0;
          }

          .slideshow-header {
            padding: 15px;
          }

          .slideshow-title {
            font-size: 20px;
            margin-bottom: 15px;
          }

          .slideshow-main {
            height: calc(100% - 150px);
          }

          .slideshow-nav {
            width: 40px;
            height: 40px;
            font-size: 28px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="events-hero">
        <div className="events-hero-image">
          <img src="/celebration-1.jpg" alt="Beautiful event celebration setting" loading="lazy" />
          <div className="events-hero-overlay">
            <div className="events-hero-content">
              <h1>Our Events</h1>
              <p className="events-subtitle">Discover magical baby shower celebrations</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container">
        {/* Upcoming Events Section */}
        <section>
          <h2 style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px', fontWeight: '700', color: 'var(--charcoal)' }}>
            Magical Moments
          </h2>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            {[
              { key: "all", label: "All Events", count: events.length },
              { key: "upcoming", label: "Upcoming Events", count: events.filter(e => e.eventStatus === "Approved").length },
              { key: "past", label: "Past Events", count: events.filter(e => e.eventStatus === "Completed").length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎪</div>
              <h3 className="empty-title">No Events Found</h3>
              <p className="empty-text">
                {activeFilter === "all"
                  ? "There are no events available at the moment."
                  : `No ${activeFilter} events found. Try a different category.`
                }
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event, index) => {
                const photoUrl = event.gallery && event.gallery.length > 0
                  ? event.gallery[0]
                  : '/placeholder.jpg'

                return (
                  <div key={event.id} className="event-card">
                    <div
                      className="event-image-container"
                      onClick={() => openSlideshow(event, 0)}
                    >
                      <img
                        src={photoUrl}
                        alt={`${event.eventTitle} - ${event.eventTheme}`}
                        className="event-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.jpg'
                        }}
                      />
                      {/* Event status badge */}
                      <div className={`event-status-badge ${event.eventStatus === 'Approved' ? 'upcoming' : 'past'}`}>
                        {event.eventStatus === 'Approved' ? 'Upcoming' : 'Past Event'}
                      </div>
                    </div>
                    <div className="event-content">
                      <h3 className="event-title">{event.eventTitle}</h3>
                      <div className="event-details">
                        <div className="event-detail">
                          <span className="detail-icon">📅</span>
                          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                        </div>
                        <div className="event-detail">
                          <span className="detail-icon">🕐</span>
                          <span>{event.eventTime || 'TBD'}</span>
                        </div>
                        <div className="event-detail">
                          <span className="detail-icon">📍</span>
                          <span>{event.venue}</span>
                        </div>
                      </div>
                      <div className="event-cta">
                        <button
                          className="event-cta-btn"
                          onClick={() => openSlideshow(event, 0)}
                        >
                          View Details
                        </button>
                        {event.eventStatus === 'Approved' && (
                          <a
                            href="/booking"
                            className="event-cta-btn secondary"
                          >
                            Register
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {/* Slideshow Modal */}
      {showSlideshow && currentEvent && (
        <div className="slideshow-modal-overlay" onClick={closeSlideshow}>
          <div className="slideshow-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="slideshow-close" onClick={closeSlideshow}>&times;</button>

            {/* Event Details */}
            <div className="slideshow-header">
              <h2 className="slideshow-title">{currentEvent.eventTitle}</h2>
              <div className="slideshow-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{new Date(currentEvent.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🕐</span>
                  <span>{currentEvent.eventTime || 'TBD'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{currentEvent.venue}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎭</span>
                  <span>{currentEvent.eventTheme}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <span>{currentEvent.numberOfGuests} guests expected</span>
                </div>
              </div>
            </div>

            {/* Image Slideshow */}
            <div className="slideshow-main">
              {currentEvent.gallery && currentEvent.gallery.length > 0 ? (
                <>
                  <div className="slideshow-image-container">
                    <img
                      src={currentEvent.gallery[currentImageIndex]}
                      alt={`${currentEvent.eventTitle} - Image ${currentImageIndex + 1}`}
                      className="slideshow-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.jpg'
                      }}
                    />
                  </div>

                  {/* Navigation */}
                  {currentEvent.gallery.length > 1 && (
                    <>
                      <button className="slideshow-nav slideshow-prev" onClick={prevImage}>
                        ‹
                      </button>
                      <button className="slideshow-nav slideshow-next" onClick={nextImage}>
                        ›
                      </button>
                    </>
                  )}

                  {/* Counter */}
                  <div className="slideshow-counter">
                    {currentImageIndex + 1} of {currentEvent.gallery.length}
                  </div>
                </>
              ) : (
                <div className="slideshow-no-images">
                  <div className="no-images-icon">📷</div>
                  <p>No images available for this event</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </>
  )
}