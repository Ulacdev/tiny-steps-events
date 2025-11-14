"use client"

import { useEffect } from "react"
import { PublicHeader } from "../../components/public-header"
import { PublicFooter } from "../../components/public-footer"

export default function ContactPage() {
  useEffect(() => {
    const contactForm = document.getElementById("contactForm") as HTMLFormElement
    if (contactForm) {
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const firstName = (document.getElementById('contactFirstName') as HTMLInputElement)?.value?.trim()
        const lastName = (document.getElementById('contactLastName') as HTMLInputElement)?.value?.trim()
        const email = (document.getElementById('contactEmail') as HTMLInputElement)?.value?.trim()
        const phone = (document.getElementById('contactPhone') as HTMLInputElement)?.value?.trim()
        const subject = (document.getElementById('contactSubject') as HTMLSelectElement)?.value
        const message = (document.getElementById('contactMessage') as HTMLTextAreaElement)?.value?.trim()

        const starRating = document.querySelector('input[name="rating"]:checked') as HTMLInputElement
        const rating = starRating ? parseInt(starRating.value) : 0

        if (!firstName || !lastName || !email || !message || !subject) {
          alert("Please fill in all required fields.")
          return
        }

        if (rating === 0) {
          alert("Please select a star rating.")
          return
        }

        try {
          const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: 'Admin',
              subject: `Contact Form: ${subject} - ${firstName} ${lastName}`,
              body: `NEW CONTACT FORM MESSAGE RECEIVED:\n\n👤 Contact Information:\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\n\n⭐ Star Rating: ${rating} stars\n\n📝 Subject: ${subject}\n\n💬 Message:\n${message}\n\n---\nThis message was submitted from the website contact form.`,
              type: 'Inbox'
            }),
          })

          const result = await response.json()

          if (result.success) {
            alert("Thank you for your message! We will get back to you within 24 hours.")
            contactForm.reset()
            const stars = document.querySelectorAll('input[name="rating"]')
            stars.forEach(star => {
              (star as HTMLInputElement).checked = false
            })
          } else {
            alert("Failed to send message. Please try again.")
          }
        } catch (error) {
          console.error('Error sending contact message:', error)
          alert("Failed to send message. Please try again.")
        }
      })
    }
  }, [])

  return (
    <>
      <PublicHeader />

      <style jsx>{`
        /* Hero Section */
        .contact-hero {
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

        .contact-hero-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .contact-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7);
          transition: transform 0.5s ease;
        }

        .contact-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(163, 216, 255, 0.2) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-hero-content {
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 0 32px;
        }

        .contact-hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
          letter-spacing: -1px;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .contact-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
          line-height: 1.6;
          font-weight: 400;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Contact Info Section */
        .contact-info-section {
          padding: 80px 0;
          background: white;
        }

        .contact-info-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .contact-map-section {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 15px;
          border: 2px solid rgba(255, 182, 193, 0.2);
          padding: 32px;
          transition: all 0.3s ease;
        }

        .contact-map-section:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 25px rgba(255, 182, 193, 0.15);
        }

        .contact-map-section h4 {
          color: var(--primary);
          margin-bottom: 16px;
          font-size: 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .contact-map-section h4::before {
          content: '📍';
        }

        .contact-map-section p {
          color: var(--foreground);
          margin-bottom: 16px;
          font-size: 1rem;
        }

        .contact-map-section iframe {
          width: 100%;
          height: 350px;
          border: none;
          border-radius: 10px;
          margin-top: 16px;
        }

        .contact-details-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .contact-info-item {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 15px;
          border: 2px solid rgba(255, 182, 193, 0.2);
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .contact-info-item:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 25px rgba(255, 182, 193, 0.15);
        }

        .contact-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 16px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-icon svg {
          width: 100%;
          height: 100%;
          fill: var(--primary);
          filter: drop-shadow(0 2px 4px rgba(255, 105, 180, 0.2));
        }

        .contact-info-item h4 {
          color: var(--primary);
          margin-bottom: 8px;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .contact-info-item p {
          color: var(--foreground);
          font-weight: 500;
          margin: 0;
        }

        /* Contact Form Section */
        .contact-form-section {
        padding: 80px 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 1) 100%);
        }

        .contact-form {
          max-width: 600px;
          margin: 0 auto;
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

        .form-label {
          display: block;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.2rem;
          border: 2px solid rgba(255, 182, 193, 0.3);
          background: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          font-family: var(--font-sans);
          font-weight: 500;
          transition: all 0.3s ease;
          border-radius: 12px;
          color: var(--foreground);
          box-shadow: 0 3px 12px rgba(255, 105, 180, 0.08);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(255, 182, 193, 0.15), 0 6px 20px rgba(255, 105, 180, 0.2);
          background: #ffffff;
          transform: translateY(-2px);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          border-radius: 12px;
        }

        /* Star Rating */
        .star-rating {
          display: flex;
          gap: 8px;
          font-size: 2.2rem;
          justify-content: center;
          direction: rtl;
        }

        .star-rating input {
          display: none;
        }

        .star-rating label {
          color: #ddd;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 5px;
          border-radius: 50%;
        }

        .star-rating input:checked ~ label,
        .star-rating label:hover,
        .star-rating label:hover ~ label {
          color: var(--primary);
          transform: scale(1.1);
        }

        .rating-text {
          text-align: center;
          font-size: 0.9rem;
          color: var(--muted-foreground);
          margin-top: 8px;
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .contact-hero {
            height: 50vh;
            min-height: 300px;
          }

          .contact-hero-content h1 {
            font-size: 2.5rem;
          }

          .contact-subtitle {
            font-size: 1.1rem;
          }

          .contact-info-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .contact-map-section {
            padding: 24px;
          }

          .contact-map-section iframe {
            height: 250px;
          }

          .contact-details-section {
            gap: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .contact-hero {
            height: 40vh;
            min-height: 250px;
            margin-top: 70px;
          }

          .contact-hero-content h1 {
            font-size: 2rem;
          }

          .contact-hero-content {
            padding: 0 20px;
          }

          .contact-subtitle {
            font-size: 1rem;
          }

          .contact-info-section {
            padding: 60px 0;
          }

          .contact-info-layout {
            gap: 24px;
          }

          .contact-map-section {
            padding: 20px;
          }

          .contact-map-section iframe {
            height: 200px;
          }

          .contact-info-item {
            padding: 20px;
          }

          .contact-icon {
            width: 50px;
            height: 50px;
          }

          .contact-form-section {
            padding: 60px 0;
          }

          .form-input {
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
      <section className="contact-hero">
        <div className="contact-hero-image">
          <img src="/contact.jpg" alt="Contact Tiny Steps" loading="lazy" />
          <div className="contact-hero-overlay">
            <div className="contact-hero-content">
              <h1>Get in Touch</h1>
              <p className="contact-subtitle">We'd love to hear from you! Tell us your vision and we'll help you make it a magical baby shower.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="glass-panel">
            <h2 style={{ textAlign: 'center', marginBottom: '48px', fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              Contact Information
            </h2>
            <div className="contact-info-layout">
              {/* Large Map on the Left */}
              <div className="contact-map-section">
                <h4>Our Location</h4>
                <p>Visit us at our office location in Rosario, Cavite. We're conveniently located and easy to find!</p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15447.1234!2d120.8533!3d14.4167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sRosario%2C%20Cavite%2C%20Philippines!2m3!1d0!2d0!3d0!3m2!1e0!2e0!4e0!5e0!3m2!1sen!2sph!4v1699999999999!5m2!1sen!2sph"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tiny Steps Office Location - Rosario, Cavite"
                ></iframe>
              </div>

              {/* Contact Details on the Right */}
              <div className="contact-details-section">
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  <h4>Call Us</h4>
                  <p>+63 917 123 4567</p>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <h4>Email</h4>
                  <p>info@tinysteps.com</p>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </div>
                  <h4>Office Hours</h4>
                  <p>Monday–Friday, 9 am–5 pm</p>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <h4>Address</h4>
                  <p>Wawa 1, Rosario, Cavite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="glass-panel">
            <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              Send Us a Message
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--muted-foreground)', fontSize: '1.1rem' }}>
              Have questions or want to discuss your event? We'd love to hear from you!
            </p>

            <form id="contactForm" className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input id="contactFirstName" type="text" className="form-input" placeholder="John" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input id="contactLastName" type="text" className="form-input" placeholder="Doe" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input id="contactEmail" type="email" className="form-input" placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input id="contactPhone" type="tel" className="form-input" placeholder="+63 917 123 4567" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select id="contactSubject" className="form-input" required>
                  <option value="">Select a subject</option>
                  <option>General Inquiry</option>
                  <option>Event Planning</option>
                  <option>Pricing Information</option>
                  <option>Venue Questions</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea id="contactMessage" className="form-input form-textarea" placeholder="Tell us about your event vision..." required></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Rate Your Experience</label>
                <div className="star-rating">
                  <input type="radio" id="star5" name="rating" value="5" /><label htmlFor="star5">★</label>
                  <input type="radio" id="star4" name="rating" value="4" /><label htmlFor="star4">★</label>
                  <input type="radio" id="star3" name="rating" value="3" /><label htmlFor="star3">★</label>
                  <input type="radio" id="star2" name="rating" value="2" /><label htmlFor="star2">★</label>
                  <input type="radio" id="star1" name="rating" value="1" /><label htmlFor="star1">★</label>
                </div>
                <p className="rating-text">How would you rate your overall experience with us?</p>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  )
}