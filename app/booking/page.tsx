"use client"

import { useEffect } from "react"
import { PublicHeader } from "../../components/public-header"
import { PublicFooter } from "../../components/public-footer"

export default function BookingPage() {
  useEffect(() => {
    const bookingForm = document.getElementById("bookingForm") as HTMLFormElement
    if (bookingForm) {
      bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const name = (document.getElementById('reservationName') as HTMLInputElement)?.value?.trim()
        const email = (document.getElementById('reservationEmail') as HTMLInputElement)?.value?.trim()
        const phone = (document.getElementById('reservationPhone') as HTMLInputElement)?.value?.trim()
        const eventType = (document.getElementById('eventType') as HTMLSelectElement)?.value
        const preferredDate = (document.getElementById('preferredDate') as HTMLInputElement)?.value
        const guestCount = (document.getElementById('guestCount') as HTMLInputElement)?.value
        const budget = (document.getElementById('budget') as HTMLSelectElement)?.value
        const specialRequests = (document.getElementById('specialRequests') as HTMLTextAreaElement)?.value?.trim()

        // Validate required fields
        if (!name || !email || !phone || !preferredDate || !guestCount ||
            eventType === 'Select event type' || !eventType ||
            budget === 'Select budget range' || !budget) {
          if (document.getElementById('reservationMessageDisplay')) {
            const messageEl = document.getElementById('reservationMessageDisplay') as HTMLElement
            messageEl.textContent = 'Please fill in all required fields and make valid selections.'
            messageEl.className = 'feedback-message error'
            messageEl.style.display = 'block'
          }
          return
        }

        if (document.getElementById('reservationMessageDisplay')) {
          const messageEl = document.getElementById('reservationMessageDisplay') as HTMLElement
          messageEl.textContent = 'Sending your reservation inquiry...'
          messageEl.className = 'feedback-message'
          messageEl.style.display = 'block'
        }

        try {
          const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientName: name,
              contactNumber: phone,
              email: email,
              eventTitle: `${eventType} for ${name}`,
              eventTheme: eventType === 'Baby Shower' ? 'Twinkle Star' :
                         eventType === 'Bridal Shower' ? 'Elegant Rose' :
                         eventType === 'Birthday Party' ? 'Celebration' :
                         eventType === 'Corporate Event' ? 'Professional' : 'Custom',
              packageType: budget === 'Under ₱15,000' ? 'Basic' :
                          budget === '₱15,000 - ₱25,000' ? 'Standard' :
                          budget === '₱25,000 - ₱35,000' ? 'Premium' :
                          budget === '₱35,000 - ₱50,000' ? 'Deluxe' : 'Custom',
              eventDate: preferredDate,
              eventTime: '2:00',
              venue: 'To be confirmed by admin',
              numberOfGuests: parseInt(guestCount),
              paymentStatus: 'Pending',
              totalAmount: budget === 'Under ₱15,000' ? 12000 :
                          budget === '₱15,000 - ₱25,000' ? 20000 :
                          budget === '₱25,000 - ₱35,000' ? 30000 :
                          budget === '₱35,000 - ₱50,000' ? 40000 : 50000,
              remarks: `Event Type: ${eventType}\nBudget Range: ${budget}\nSpecial Requests: ${specialRequests || 'None specified'}\n\nSubmitted via website reservation form.`,
              eventStatus: 'Pending'
            }),
          })

          const result = await response.json()

          if (result.success) {
            await fetch('/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: 'Admin',
                subject: `New Event Booking - ${eventType} for ${name}`,
                body: `NEW EVENT BOOKING RECEIVED:\n\n👤 Client Information:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n🎉 Event Details:\nType: ${eventType}\nTitle: ${eventType} for ${name}\nPreferred Date: ${preferredDate}\nExpected Guests: ${guestCount}\nBudget Range: ${budget}\nTheme: ${eventType === 'Baby Shower' ? 'Twinkle Star' : eventType === 'Bridal Shower' ? 'Elegant Rose' : eventType === 'Birthday Party' ? 'Celebration' : eventType === 'Corporate Event' ? 'Professional' : 'Custom'}\n\n📝 Special Requests:\n${specialRequests || 'No special requests mentioned'}\n\n✅ Event booking has been created in the Events module with status "Pending".\nPlease review and confirm the booking details.\n\n---\nThis booking was submitted from the website reservation form.`,
                type: 'Reservation'
              }),
            }).catch(() => {})

            if (document.getElementById('reservationMessageDisplay')) {
              const messageEl = document.getElementById('reservationMessageDisplay') as HTMLElement
              messageEl.textContent = 'Thank you for your reservation! Your event booking has been created and is pending confirmation. We\'ll contact you within 24 hours to finalize details. 🎉'
              messageEl.className = 'feedback-message success'
            }

            bookingForm.reset()

            setTimeout(() => {
              if (document.getElementById('reservationMessageDisplay')) {
                const messageEl = document.getElementById('reservationMessageDisplay') as HTMLElement
                messageEl.style.display = 'none'
              }
            }, 8000)
          } else {
            if (document.getElementById('reservationMessageDisplay')) {
              const messageEl = document.getElementById('reservationMessageDisplay') as HTMLElement
              messageEl.textContent = 'Failed to create reservation. Please try again or contact us directly.'
              messageEl.className = 'feedback-message error'
            }
          }
        } catch (error) {
          console.error('Error creating reservation:', error)
          if (document.getElementById('reservationMessageDisplay')) {
            const messageEl = document.getElementById('reservationMessageDisplay') as HTMLElement
            messageEl.textContent = 'Failed to create reservation. Please try again or contact us directly.'
            messageEl.className = 'feedback-message error'
          }
        }
      })
    }
  }, [])

  return (
    <>
      <PublicHeader />

      <style jsx>{`
        /* Hero Section */
        .booking-hero {
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

        .booking-hero-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .booking-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7);
          transition: transform 0.5s ease;
        }

        .booking-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(163, 216, 255, 0.3) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .booking-hero-content {
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 0 32px;
        }

        .booking-hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
          letter-spacing: -1px;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .booking-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
          line-height: 1.6;
          font-weight: 400;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Booking Form Section */
        .booking-section {
          padding: 80px 0;
          background: white;
        }

        .booking-form-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }

        .booking-form {
          background: white;
          padding: 40px;
          border-radius: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 158, 207, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(255, 158, 207, 0.3);
          border-radius: 12px;
          font-family: var(--font-sans);
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          color: var(--charcoal);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.1);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
          color: white;
          padding: 1.2rem 2rem;
          border-radius: 15px;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--font-sans);
          box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 105, 180, 0.5);
        }

        .submit-btn:active {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
        }

        /* Feedback Messages */
        .feedback-message {
          text-align: center;
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          display: none;
          font-weight: 500;
        }

        .feedback-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          display: block;
        }

        .feedback-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          display: block;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .booking-hero {
            height: 50vh;
            min-height: 300px;
          }

          .booking-hero-content h1 {
            font-size: 2.5rem;
          }

          .booking-subtitle {
            font-size: 1.1rem;
          }

          .booking-form {
            padding: 30px 20px;
            margin: 0 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .booking-hero {
            height: 40vh;
            min-height: 250px;
            margin-top: 70px;
          }

          .booking-hero-content h1 {
            font-size: 2rem;
          }

          .booking-hero-content {
            padding: 0 20px;
          }

          .booking-subtitle {
            font-size: 1rem;
            margin-bottom: 32px;
          }

          .booking-form {
            padding: 24px 16px;
            border-radius: 20px;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            padding: 0.875rem 1rem;
            font-size: 1rem;
          }

          .submit-btn {
            padding: 1rem 1.5rem;
            font-size: 1.1rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="booking-hero">
        <div className="booking-hero-image">
          <img src="/celebration-1.jpg" alt="Beautiful booking experience" loading="lazy" />
          <div className="booking-hero-overlay">
            <div className="booking-hero-content">
              <h1>Book Your Celebration</h1>
              <p className="booking-subtitle">Let's create magical memories together. Tell us about your vision and we'll make it happen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="booking-section">
        <div className="container">
          <div className="booking-form-wrapper">
            <div className="glass-panel">
              <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                Start Your Reservation
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--muted-foreground)', fontSize: '1.1rem' }}>
                Fill out the form below and we'll get back to you within 24 hours to discuss your perfect celebration.
              </p>

              <form id="bookingForm">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reservationName">Full Name *</label>
                    <input id="reservationName" type="text" placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reservationEmail">Email Address *</label>
                    <input id="reservationEmail" type="email" placeholder="your@email.com" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reservationPhone">Phone Number *</label>
                    <input id="reservationPhone" type="tel" placeholder="(555) 123-4567" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventType">Event Type *</label>
                    <select id="eventType" required>
                      <option>Select event type</option>
                      <option>Baby Shower</option>
                      <option>Bridal Shower</option>
                      <option>Birthday Party</option>
                      <option>Corporate Event</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="preferredDate">Preferred Date *</label>
                    <input id="preferredDate" type="date" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guestCount">Expected Guests *</label>
                    <input id="guestCount" type="number" placeholder="50" min="1" required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Budget Range *</label>
                  <select id="budget" required>
                    <option>Select budget range</option>
                    <option>Under ₱15,000</option>
                    <option>₱15,000 - ₱25,000</option>
                    <option>₱25,000 - ₱35,000</option>
                    <option>₱35,000 - ₱50,000</option>
                    <option>₱50,000+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Special Requests</label>
                  <textarea id="specialRequests" placeholder="Tell us about your vision, theme preferences, or any special requirements..."></textarea>
                </div>

                <button type="submit" className="submit-btn">Submit Reservation</button>
              </form>

              <div id="reservationMessageDisplay" className="feedback-message"></div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  )
}