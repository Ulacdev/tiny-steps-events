"use client"

import { PublicHeader } from "../../components/public-header"
import { PublicFooter } from "../../components/public-footer"

export default function AboutPage() {
  return (
    <>
      <PublicHeader />

      <style jsx>{`
        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 80px 0;
          background: linear-gradient(135deg, rgba(255, 230, 241, 0.1) 0%, rgba(163, 216, 255, 0.1) 100%);
        }

        .hero-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .hero-content {
          opacity: 0;
          animation: fadeUp 1s ease-out 0.3s both;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 24px;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--warm-gray);
          margin-bottom: 40px;
          line-height: 1.6;
          font-weight: 400;
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

        .hero-image-container {
          position: relative;
          opacity: 0;
          animation: fadeUp 1s ease-out 0.6s both;
        }

        .hero-image {
          width: 100%;
          height: 600px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(255, 123, 180, 0.2);
          position: relative;
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .hero-image:hover img {
          transform: scale(1.05);
        }

        /* Floating Elements */
        .floating-element {
          position: absolute;
          font-size: 2rem;
          opacity: 0.7;
          animation: gentleFloat 4s ease-in-out infinite;
          z-index: 1;
        }

        .floating-element.top-left { top: -20px; left: -20px; animation-delay: 0s; }
        .floating-element.top-right { top: -20px; right: -20px; animation-delay: 2s; }
        .floating-element.bottom-left { bottom: -20px; left: -20px; animation-delay: 1s; }
        .floating-element.bottom-right { bottom: -20px; right: -20px; animation-delay: 3s; }

        /* Story Section */
        .story-section {
          padding: 80px 0;
          background: white;
        }

        .story-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .story-content {
          opacity: 0;
          animation: fadeUp 1s ease-out both;
        }

        .story-title {
          font-size: 40px;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 24px;
          line-height: 1.2;
        }

        .story-text {
          font-size: 18px;
          line-height: 1.7;
          color: var(--warm-gray);
          margin-bottom: 40px;
          font-weight: 400;
        }

        .story-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 230, 241, 0.3) 0%, rgba(163, 216, 255, 0.1) 100%);
          border-radius: 16px;
          border: 1px solid rgba(255, 123, 180, 0.1);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          transform: translateX(8px);
          background: linear-gradient(135deg, rgba(255, 230, 241, 0.4) 0%, rgba(163, 216, 255, 0.2) 100%);
          box-shadow: 0 8px 20px rgba(255, 123, 180, 0.1);
        }

        .feature-icon {
          font-size: 24px;
          color: var(--pink-rose);
          min-width: 24px;
        }

        .feature-text {
          font-size: 16px;
          color: var(--charcoal);
          font-weight: 500;
        }

        .story-image-container {
          position: relative;
          opacity: 0;
          animation: fadeUp 1s ease-out 0.3s both;
        }

        .story-image {
          width: 100%;
          height: 500px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(255, 123, 180, 0.15);
          position: relative;
        }

        .story-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .story-image:hover img {
          transform: scale(1.03);
        }

        /* Stats Section */
        .stats-section {
          padding: 80px 0;
          background: linear-gradient(135deg, rgba(255, 230, 241, 0.5) 0%, rgba(163, 216, 255, 0.5) 100%);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 20px;
          padding: 40px 24px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.1);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .stat-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(255, 105, 180, 0.2);
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 12px;
          display: block;
          font-family: serif;
        }

        .stat-label {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--muted-foreground);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Animations */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) rotate(2deg);
          }
          66% {
            transform: translateY(-15px) rotate(-1deg);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-container,
          .story-container {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .hero-title {
            font-size: 48px;
          }

          .story-title {
            font-size: 32px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 0;
          }

          .hero-container,
          .story-container {
            padding: 0 20px;
            gap: 40px;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .hero-cta {
            padding: 14px 32px;
            font-size: 16px;
          }

          .hero-image {
            height: 400px;
          }

          .story-title {
            font-size: 28px;
          }

          .story-text {
            font-size: 16px;
          }

          .story-image {
            height: 350px;
          }

          .feature-item {
            padding: 16px;
          }

          .feature-text {
            font-size: 14px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 0 20px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 40px 0;
          }

          .hero-container,
          .story-container {
            padding: 0 15px;
          }

          .hero-title {
            font-size: 28px;
            line-height: 1.2;
          }

          .hero-subtitle {
            font-size: 16px;
            margin-bottom: 32px;
          }

          .hero-cta {
            padding: 12px 24px;
            font-size: 14px;
          }

          .hero-image {
            height: 300px;
          }

          .story-title {
            font-size: 24px;
          }

          .story-text {
            font-size: 15px;
          }

          .story-image {
            height: 250px;
          }

          .feature-item {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .feature-icon {
            font-size: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-item {
            padding: 32px 20px;
          }

          .stat-number {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">About Tiny Steps</h1>
            <p className="hero-subtitle">
              We believe every baby shower should be a magical celebration filled with joy, laughter, and unforgettable moments.
              Since 2015, Tiny Steps has been helping families create perfect baby shower experiences.
            </p>
            <a href="/booking" className="hero-cta">Start Your Celebration</a>
          </div>
          <div className="hero-image-container">
            <div className="hero-image">
              <img src="/about.jpg" alt="About Tiny Steps - Our story and mission" />
              <div className="floating-element top-left">✨</div>
              <div className="floating-element top-right">🌸</div>
              <div className="floating-element bottom-left">🦋</div>
              <div className="floating-element bottom-right">🎈</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Started Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content">
            <h2 className="story-title">How It Started</h2>
            <p className="story-text">
              Tiny Steps began as a dream shared by two sisters who wanted to create magical moments for families welcoming new life.
              What started as backyard celebrations has grown into a full-service event planning company specializing in baby showers,
              bridal showers, and family gatherings.
            </p>
            <div className="story-features">
              <div className="feature-item">
                <span className="feature-icon">💫</span>
                <span className="feature-text">Personalized themes tailored to your vision</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎨</span>
                <span className="feature-text">Creative decor and styling expertise</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👨‍👩‍👧‍👦</span>
                <span className="feature-text">Family-focused celebrations</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span className="feature-text">Memorable experiences that last a lifetime</span>
              </div>
            </div>
          </div>
          <div className="story-image-container">
            <div className="story-image">
              <img src="/baby-shower-1.jpg" alt="Elegant baby shower setup" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Happy Families</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Satisfaction Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Events Per Year</span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  )
}