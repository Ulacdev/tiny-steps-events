"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          position: fixed;
          width: 100%;
          top: 0;
          height: 80px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 1000;
          box-shadow: 0 2px 16px rgba(255, 123, 180, 0.1);
          border-bottom: 1px solid rgba(255, 230, 241, 0.3);
          transition: all 0.3s ease;
        }

        .header.scrolled {
          height: 65px;
          box-shadow: 0 4px 20px rgba(255, 123, 180, 0.15);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.3s ease;
        }

        .header.scrolled .logo {
          transform: scale(0.9);
        }

        .logo img {
          width: 140px;
          height: auto;
          object-fit: contain;
          filter: brightness(1.1) saturate(1.2);
        }

        .nav {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .nav-link {
          color: #2B2B2B;
          font-weight: 500;
          font-size: 16px;
          transition: all 0.3s ease;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          position: relative;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #FF7BB4;
          background: rgba(255, 123, 180, 0.05);
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: #FF7BB4;
          border-radius: 1px;
        }

        .login-btn {
          background: linear-gradient(135deg, #FF7BB4 0%, #FF8DC3 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 16px;
          font-weight: 600;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 16px rgba(255, 123, 180, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .login-btn:hover {
          background: linear-gradient(135deg, #FF8DC3 0%, #FF7BB4 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 141, 195, 0.5);
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          color: #2B2B2B;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .menu-toggle:hover {
          background: rgba(255, 123, 180, 0.1);
          color: #FF7BB4;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid rgba(255, 230, 241, 0.3);
          flex-direction: column;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(255, 123, 180, 0.15);
          gap: 16px;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu .nav-link {
          padding: 12px 20px;
          width: 100%;
          text-align: center;
          border-radius: 12px;
          color: #2B2B2B;
        }

        .mobile-menu .nav-link:hover,
        .mobile-menu .nav-link.active {
          background: rgba(255, 123, 180, 0.1);
          color: #FF7BB4;
        }

        .mobile-menu .login-btn {
          margin-top: 16px;
          width: 100%;
          text-align: center;
        }

        @media (max-width: 768px) {
          .header {
            padding: 0 20px;
            height: 70px;
          }

          .header.scrolled {
            height: 60px;
          }

          .logo img {
            width: 120px;
          }

          .nav {
            display: none;
          }

          .menu-toggle {
            display: block;
          }

          .mobile-menu {
            display: flex;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 0 15px;
            height: 65px;
          }

          .header.scrolled {
            height: 55px;
          }

          .logo img {
            width: 100px;
          }

          .mobile-menu {
            padding: 16px;
          }
        }
      `}</style>

      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <a href="/">
            <img src="/tiny-steps-logo.svg" alt="Tiny Steps Logo" />
          </a>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/events" className="nav-link">Events</a>
          <a href="/booking" className="nav-link">Booking</a>
          <a href="/contact" className="nav-link">Contact</a>
          <button className="login-btn" onClick={handleLogin}>Login</button>
        </nav>

        <nav className={`nav mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <a href="/" className="nav-link" onClick={closeMenu}>Home</a>
          <a href="/about" className="nav-link" onClick={closeMenu}>About</a>
          <a href="/events" className="nav-link" onClick={closeMenu}>Events</a>
          <a href="/booking" className="nav-link" onClick={closeMenu}>Booking</a>
          <a href="/contact" className="nav-link" onClick={closeMenu}>Contact</a>
          <button className="login-btn" onClick={handleLogin}>Login</button>
        </nav>
      </header>
    </>
  )
}