export function PublicFooter() {
  return (
    <>
      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #FF7BB4 0%, #FF8DC3 100%);
          border-top: 1px solid rgba(255, 141, 195, 0.3);
          padding: 48px 0 24px 0;
          margin-top: 80px;
          color: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 48px;
          margin-bottom: 32px;
        }

        .footer-section h4 {
          color: white;
          margin-bottom: 16px;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-section h4::before {
          content: '✨';
          font-size: 16px;
        }

        .footer-section p,
        .footer-section a {
          color: rgba(255, 255, 255, 0.9);
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-section a:hover {
          color: white;
          transform: translateX(4px);
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-logo img {
          width: 120px;
          height: auto;
          filter: brightness(0) invert(1);
        }

        .footer-logo h3 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .social-icons {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .social-icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-icon:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .social-icon svg {
          width: 20px;
          height: 20px;
          fill: white;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .footer-bottom p {
          margin: 0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 20px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .footer-section h4 {
            font-size: 16px;
          }

          .social-icons {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 32px 0 16px 0;
          }

          .container {
            padding: 0 15px;
          }

          .footer-logo img {
            width: 100px;
          }

          .footer-logo h3 {
            font-size: 18px;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/tiny-steps-logo.svg" alt="Tiny Steps Logo" />
              </div>
              <p>Creating magical baby shower experiences since 2015. Every celebration tells a story, and we're here to make yours unforgettable.</p>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 7.966.021 6.675.049c-1.272.028-2.14.136-2.897.289a4.943 4.943 0 0 0-1.777.9 4.943 4.943 0 0 0-.9 1.777c-.153.757-.261 1.625-.289 2.897C1.99 7.966 1.969 8.396 1.969 12.017s.021 4.051.049 5.342c.028 1.272.136 2.14.289 2.897a4.943 4.943 0 0 0 .9 1.777 4.943 4.943 0 0 0 1.777.9c.757.153 1.625.261 2.897.289 1.291.028 1.721.049 5.342.049s4.051-.021 5.342-.049c1.272-.028 2.14-.136 2.897-.289a4.943 4.943 0 0 0 1.777-.9 4.943 4.943 0 0 0 .9-1.777c.153-.757.261-1.625.289-2.897.028-1.291.049-1.721.049-5.342s-.021-4.051-.049-5.342c-.028-1.272-.136-2.14-.289-2.897a4.943 4.943 0 0 0-.9-1.777 4.943 4.943 0 0 0-1.777-.9c-.757-.153-1.625-.261-2.897-.289C16.068.021 15.638 0 12.017 0zm0 2.163c3.574 0 3.997.014 5.409.078 1.371.062 2.113.29 2.611.483a3.02 3.02 0 0 1 1.086.709c.302.3.558.697.709 1.086.193.498.421 1.24.483 2.611.064 1.412.078 1.835.078 5.409s-.014 3.997-.078 5.409c-.062 1.371-.29 2.113-.483 2.611a3.02 3.02 0 0 1-.709 1.086c-.3.302-.697.558-1.086.709-.498.193-1.24.421-2.611.483-1.412.064-1.835.078-5.409.078s-3.997-.014-5.409-.078c-1.371-.062-2.113-.29-2.611-.483a3.02 3.02 0 0 1-1.086-.709c-.302-.3-.558-.697-.709-1.086-.193-.498-.421-1.24-.483-2.611-.064-1.412-.078-1.835-.078-5.409s.014-3.997.078-5.409c.062-1.371.29-2.113.483-2.611a3.02 3.02 0 0 1 .709-1.086c.3-.302.697-.558 1.086-.709.498-.193 1.24-.421 2.611-.483 1.412-.064 1.835-.078 5.409-.078zm0 3.977a6.04 6.04 0 1 0 0 12.08 6.04 6.04 0 0 0 0-12.08zm0 9.977a3.977 3.977 0 1 1 0-7.954 3.977 3.977 0 0 1 0 7.954zm6.406-11.845a1.44 1.44 0 1 1 0 2.881 1.44 1.44 0 0 1 0-2.881z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Pinterest">
                  <svg viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.75.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="/">Home</a>
              <a href="/about">About Us</a>
              <a href="/events">Our Events</a>
              <a href="/booking">Book Now</a>
              <a href="/contact">Contact Us</a>
            </div>

            <div className="footer-section">
              <h4>Services</h4>
              <a href="/booking">Event Planning</a>
              <a href="/booking">Decor Setup</a>
              <a href="/booking">Catering</a>
              <a href="/booking">Photography</a>
              <a href="/contact">Consultation</a>
            </div>

            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>Wawa 1, Rosario, Cavite</p>
              <p>Phone: +63 917 123 4567</p>
              <p>Email: info@tinysteps.com</p>
              <p>Mon-Fri: 9AM-5PM</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Tiny Steps Event Management. All rights reserved. Made with ❤️ for magical celebrations.</p>
          </div>
        </div>
      </footer>
    </>
  )
}