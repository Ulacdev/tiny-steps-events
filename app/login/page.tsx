"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Try admin login first
      const adminResponse = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const adminData = await adminResponse.json()

      if (adminData.success) {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userRole", "admin")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", adminData.user.name)
        router.push("/admin/dashboard")
        setLoading(false)
        return
      }
    } catch (error) {
      console.error('Admin login error:', error)
    }

    // If admin login failed, try user login
    try {
      const response = await fetch('/api/account-registrations')
      const data = await response.json()

      if (data.success) {
        const userAccount = data.data.find((account: any) =>
          account.email === email &&
          account.password === password
        )

        if (userAccount) {
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("userRole", "user")
          localStorage.setItem("userEmail", email)
          localStorage.setItem("userName", userAccount.name)
          router.push("/user/dashboard")
        } else {
          alert('Invalid credentials!')
        }
      } else {
        alert('Login failed! Please try again.')
      }
    } catch (error) {
      console.error('User login error:', error)
      alert("Login failed! Please try again.")
    }

    setLoading(false)
  }

  return (
    <>
      <style jsx global>{`
        /* ==================== */
        /* MODERN SPLIT-SCREEN LOGIN PAGE */
        /* ==================== */

        :root {
          --primary-pink: #ffb6c1;
          --soft-pink: #ffd1dc;
          --baby-blue: #c8e7ff;
          --lavender: #e6d5fa;
          --cream: #fffdf6;
          --foreground: #2d2d2d;
          --muted: #787878;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100vh;
          overflow: hidden;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        body {
          background: #ffffff;
          color: var(--foreground);
        }

        /* Split Screen Layout */
        .login-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        /* Left Side - Hero Image */
        .left-side {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(200, 231, 255, 0.1) 100%);
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.9) contrast(1.1);
          animation: imageFadeIn 1.5s ease-out;
        }

        @keyframes imageFadeIn {
          0% {
            opacity: 0;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Vignette Overlay */
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, transparent 40%, rgba(255, 182, 193, 0.2) 100%);
          pointer-events: none;
        }

        /* Floating Decorative Elements */
        .floating-element {
          position: absolute;
          font-size: 2rem;
          opacity: 0.6;
          animation: gentleFloat 4s ease-in-out infinite;
          pointer-events: none;
        }

        .floating-element.baby {
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .floating-element.balloon {
          top: 15%;
          right: 20%;
          animation-delay: 1s;
        }

        .floating-element.star {
          bottom: 25%;
          left: 20%;
          animation-delay: 2s;
        }

        .floating-element.heart {
          bottom: 20%;
          right: 15%;
          animation-delay: 3s;
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(2deg);
          }
          66% {
            transform: translateY(-20px) rotate(-1deg);
          }
        }

        /* Right Side - Login Card */
        .right-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(200, 231, 255, 0.3) 0%, rgba(255, 218, 196, 0.3) 100%);
        }

        /* Glass Login Card */
        .login-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 2px solid rgba(255, 182, 193, 0.2);
          border-radius: 35px;
          padding: 3rem 2.5rem;
          box-shadow: 0 25px 50px rgba(255, 105, 180, 0.15),
                      0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
          max-width: 450px;
          width: 100%;
          animation: cardSlideIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
          overflow: hidden;
        }

        @keyframes cardSlideIn {
          0% {
            opacity: 0;
            transform: translateX(50px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        /* Gradient Border Top */
        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--primary-pink) 0%, var(--baby-blue) 50%, var(--lavender) 100%);
          border-radius: 35px 35px 0 0;
        }

        /* Title */
        .login-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--foreground);
          text-align: center;
          margin-bottom: 2.5rem;
          font-family: 'Poppins', sans-serif;
          letter-spacing: -0.5px;
          position: relative;
        }

        .login-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, var(--primary-pink), var(--baby-blue));
          border-radius: 2px;
        }

        /* Form Elements */
        .form-group {
          margin-bottom: 1.8rem;
          position: relative;
        }

        .form-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 0.75rem;
          letter-spacing: 0.3px;
        }

        .form-input {
          width: 100%;
          padding: 1.2rem 1.5rem;
          border: none;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 25px;
          font-size: 1rem;
          font-family: inherit;
          color: var(--foreground);
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 8px rgba(255, 105, 180, 0.1),
                      0 4px 15px rgba(255, 105, 180, 0.08);
          outline: none;
        }

        .form-input:focus {
          background: #ffffff;
          box-shadow: inset 0 2px 8px rgba(255, 105, 180, 0.15),
                      0 0 0 3px rgba(255, 182, 193, 0.2),
                      0 6px 20px rgba(255, 105, 180, 0.15);
          transform: translateY(-2px);
        }

        .form-input::placeholder {
          color: var(--muted);
          opacity: 0.8;
        }

        /* Login Button */
        .login-btn {
          width: 100%;
          background: #ffffff;
          color: var(--primary-pink);
          border: 2px solid rgba(255, 182, 193, 0.3);
          padding: 1.2rem 2rem;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.1);
          position: relative;
          overflow: hidden;
          margin-top: 1rem;
          animation: buttonFadeIn 0.8s ease-out 0.8s both;
        }

        @keyframes buttonFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-btn:hover {
          background: linear-gradient(135deg, var(--baby-blue), var(--soft-pink));
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.2);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Footer Links */
        .login-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 182, 193, 0.2);
        }

        .signup-link {
          color: var(--muted);
          font-size: 0.95rem;
        }

        .signup-link a {
          color: var(--primary-pink);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .signup-link a:hover {
          color: var(--soft-pink);
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .login-container {
            flex-direction: column;
          }

          .left-side {
            flex: 0 0 40vh;
            min-height: 300px;
          }

          .right-side {
            flex: 1;
            padding: 1rem;
          }

          .login-card {
            padding: 2rem 1.5rem;
            border-radius: 25px;
          }

          .login-title {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 768px) {
          .left-side {
            display: none;
          }

          .right-side {
            background: linear-gradient(135deg, rgba(200, 231, 255, 0.5) 0%, rgba(255, 218, 196, 0.5) 100%);
          }

          .login-card {
            max-width: 400px;
            padding: 2rem 1.5rem;
          }

          .form-input {
            padding: 1rem 1.2rem;
          }

          .login-btn {
            padding: 1rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem 1rem;
            border-radius: 20px;
          }

          .login-title {
            font-size: 1.6rem;
          }

          .form-input {
            padding: 0.9rem 1rem;
            font-size: 0.95rem;
          }

          .login-btn {
            padding: 0.9rem 1.2rem;
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="login-container">
        {/* Left Side - Hero Image */}
        <div className="left-side">
          <img
            src="/happy-baby-in-pastel-baby-shower-setting-with-ball.jpg"
            alt="Warm, joyful baby shower scene with parents preparing for a baby shower, smiling mom holding baby shoes, pastel decorations with balloons, ribbons, and confetti in background"
            className="hero-image"
          />
          <div className="image-overlay"></div>

          {/* Floating Decorative Elements */}
          <div className="floating-element baby">👶</div>
          <div className="floating-element balloon">🎈</div>
          <div className="floating-element star">⭐</div>
          <div className="floating-element heart">💕</div>
        </div>

        {/* Right Side - Login Card */}
        <div className="right-side">
          <div className="login-card">
            <h1 className="login-title">LOGIN TO YOUR ACCOUNT</h1>

            <form onSubmit={handleSubmit}>


              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-btn"
              >
                {loading ? "Signing In..." : "LOGIN"}
              </button>
            </form>

            <div className="login-footer">
              <p className="signup-link">
                Want a reservation? <a href="/booking">Book Now</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}