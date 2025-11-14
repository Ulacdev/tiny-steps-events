"use client"

import { useEffect, useState } from "react"
import { PublicHeader } from "../components/public-header"
import { PublicFooter } from "../components/public-footer"

export default function TinyStepsLandingPage() {
  const [approvedEvents, setApprovedEvents] = useState<any[]>([])
  const [completedEvents, setCompletedEvents] = useState<any[]>([])
  const [showSlideshow, setShowSlideshow] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [heroImageIndex, setHeroImageIndex] = useState(0)

  // Hero background images for slideshow
  const heroImages = [
    '/happy-baby-in-pastel-baby-shower-setting-with-ball.jpg',
    '/baby-shower-1.jpg',
    '/baby-shower-2.jpg',
    '/celebration-1.jpg',
    '/wedding-1.jpg'
  ]

  useEffect(() => {
    // Fetch events data
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        const data = await response.json()
        if (data.success) {
          const events = data.data
          setApprovedEvents(events.filter((e: any) => e.eventStatus === 'Approved'))
          setCompletedEvents(events.filter((e: any) => e.eventStatus === 'Completed'))
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [])

  // Hero image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  const openSlideshow = (event: any, index: number) => {
    setCurrentEvent(event)
    setCurrentImageIndex(index)
    setShowSlideshow(true)
  }

  const closeSlideshow = () => {
    setShowSlideshow(false)
    setCurrentEvent(null)
  }

  const nextImage = () => {
    if (currentEvent?.gallery) {
      setCurrentImageIndex((prev) =>
        prev === currentEvent.gallery.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (currentEvent?.gallery) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? currentEvent.gallery.length - 1 : prev - 1
      )
    }
  }


  return (
    <>
      <PublicHeader />

      <style jsx>{`
        /* Hero Section */
        .hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          background: linear-gradient(135deg, rgba(255, 230, 241, 0.9) 0%, rgba(163, 216, 255, 0.9) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: opacity 1s ease-in-out;
          z-index: 1;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 32px;
          animation: fadeUp 1s ease-out;
          color: white !important;
        }

        .hero h1 {
          font-size: 56px;
          font-weight: 700;
          margin-bottom: 24px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          line-height: 1.1;
          color: white !important;
        }

        .hero p {
          font-size: 20px;
          margin-bottom: 40px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          line-height: 1.6;
          color: white !important;
        }

        .hero-cta {
          background: var(--pink-rose);
          color: white;
          padding: 16px 40px;
          border-radius: 20px;
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(255, 123, 180, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .hero-cta:hover {
          background: var(--primary-hover);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(255, 141, 195, 0.5);
        }

        /* Gallery Section */
        .gallery-section {
          padding: 40px 0;
          background: white;
          margin-top: -60px;
          position: relative;
          z-index: 3;
        }

        .gallery-tabs {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .gallery-tab {
          padding: 12px 24px;
          border: 2px solid var(--pink-blush);
          border-radius: 12px;
          background: transparent;
          color: var(--charcoal);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .gallery-tab.active {
          background: var(--pink-rose);
          color: white;
          border-color: var(--pink-rose);
        }

        .events-scroll-container {
          display: flex;
          gap: 24px;
          padding: 0 32px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 158, 207, 0.3) transparent;
        }

        .events-scroll-container::-webkit-scrollbar {
          height: 6px;
        }

        .events-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .events-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(255, 158, 207, 0.4);
          border-radius: 3px;
        }

        .events-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 158, 207, 0.6);
        }

        .event-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 158, 207, 0.1);
          min-width: 280px;
          max-width: 320px;
          flex-shrink: 0;
        }

        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(255, 123, 180, 0.15);
        }

        .event-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .event-card:hover .event-image {
          transform: scale(1.03);
        }

        .event-content {
          padding: 20px;
        }

        .event-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .event-date {
          font-size: 14px;
          color: var(--pink-rose);
          font-weight: 500;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .event-description {
          font-size: 14px;
          color: var(--warm-gray);
          line-height: 1.4;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .event-cta {
          display: flex;
          gap: 8px;
        }

        .event-cta-btn {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .event-cta-btn.primary {
          background: var(--pink-rose);
          color: white;
        }

        .event-cta-btn.secondary {
          background: var(--baby-blue);
          color: var(--charcoal);
        }

        .event-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Slideshow Modal */
        .slideshow-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
        }

        .slideshow-modal-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .slideshow-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .slideshow-close:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .slideshow-header {
          padding: 24px;
          background: var(--pink-blush);
          border-bottom: 1px solid rgba(255, 158, 207, 0.3);
        }

        .slideshow-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 16px;
        }

        .slideshow-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--warm-gray);
        }

        .slideshow-main {
          position: relative;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 500px;
        }

        .slideshow-image {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
        }

        .slideshow-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .slideshow-prev {
          left: 20px;
        }

        .slideshow-next {
          right: 20px;
        }

        .slideshow-nav:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: translateY(-50%) scale(1.1);
        }

        .slideshow-counter {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 32px;
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 36px;
          }

          .hero p {
            font-size: 18px;
          }

          .events-scroll-container {
            padding: 0 20px;
            gap: 16px;
          }

          .event-card {
            min-width: 260px;
            max-width: 280px;
          }

          .event-cta {
            flex-direction: column;
          }

          .slideshow-modal-content {
            max-width: 95vw;
            max-height: 95vh;
          }

          .slideshow-details {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: 0 20px;
          }

          .hero h1 {
            font-size: 28px;
          }

          .hero p {
            font-size: 16px;
          }

          .events-scroll-container {
            padding: 0 16px;
            gap: 12px;
          }

          .event-card {
            min-width: 240px;
            max-width: 260px;
          }

          .event-content {
            padding: 16px;
          }

          .event-title {
            font-size: 16px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero">
        <div
          className="hero-background"
          style={{ backgroundImage: `url(${heroImages[heroImageIndex]})` }}
        ></div>
        <div className="hero-content">
          <h1>Welcome to Tiny Steps</h1>
          <p>Creating magical baby shower experiences that celebrate the joy of new beginnings. Every celebration tells a story, and we're here to make yours unforgettable.</p>
          <a href="/booking" className="hero-cta">Start Your Celebration</a>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px', fontWeight: '700', color: 'var(--charcoal)' }}>
            Upcoming Events
          </h2>


          {/* Events Grid */}
          {approvedEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎪</div>
              <h3 className="empty-title">No Upcoming Events</h3>
              <p className="empty-text">
                There are no upcoming events at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="events-scroll-container">
              {approvedEvents.map((event, index) => {
                const photoUrl = event.gallery && event.gallery.length > 0
                  ? event.gallery[0]
                  : '/placeholder.jpg'

                return (
                  <div key={event.id} className="event-card">
                    <img
                      src={photoUrl}
                      alt={`${event.eventTitle} - ${event.eventTheme}`}
                      className="event-image"
                      onClick={() => openSlideshow(event, 0)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div className="event-content">
                      <h3 className="event-title">{event.eventTitle}</h3>
                      <div className="event-date">
                        <span className="detail-icon">📅</span>
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="event-description">
                        {event.eventTheme} celebration at {event.venue} for {event.numberOfGuests} guests.
                      </div>
                      <div className="event-cta">
                        <button
                          className="event-cta-btn primary"
                          onClick={() => openSlideshow(event, 0)}
                        >
                          View Gallery
                        </button>
                        <a
                          href="/booking"
                          className="event-cta-btn secondary"
                        >
                          Book Similar
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* View All Events Button */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a
              href="/events"
              style={{
                background: 'linear-gradient(135deg, var(--pink-rose) 0%, var(--primary-hover) 100%)',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(255, 105, 180, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(255, 105, 180, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 105, 180, 0.4)';
              }}
            >
              View All Events
              <span style={{ fontSize: '18px' }}>→</span>
            </a>
          </div>
        </div>
      </section>

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
                  <img
                    src={currentEvent.gallery[currentImageIndex]}
                    alt={`${currentEvent.eventTitle} - Image ${currentImageIndex + 1}`}
                    className="slideshow-image"
                  />

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
                <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
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