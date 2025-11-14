"use client"

export default function NotFoundPage() {
  return (
    <>
      <style jsx global>{`
        /* ==================== */
        /* CSS VARIABLES & RESET */
        /* ==================== */
        :root {
          /* Pastel Baby Shower Theme */
          --cream: #fffdf6;
          --peach: #ffdac4;
          --baby-blue: #c8e7ff;
          --lavender: #e6d5fa;
          --golden-yellow: #ffe696;
          --soft-pink: #ffd1dc;
          --pale-green: #dcf5e6;

          /* Text & Background */
          --foreground: #2d2d2d;
          --background: #fffdf6;
          --muted-foreground: #787878;
          --border: #e6e6e6;

          /* Primary Colors */
          --primary: #ffb6c1;
          --primary-hover: #ffd1dc;
          --secondary: #c8e7ff;
          --accent: #ffdac4;

          /* Spacing */
          --spacing-xs: 0.5rem;
          --spacing-sm: 1rem;
          --spacing-md: 1.5rem;
          --spacing-lg: 2rem;
          --spacing-xl: 3rem;
          --spacing-2xl: 4rem;

          /* Fonts */
          --font-sans: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          --font-serif: "Dancing Script", cursive;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: var(--font-sans);
          color: var(--foreground);
          background-image: url('/happy-baby-in-pastel-baby-shower-setting-with-ball.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
          line-height: 1.6;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          animation: backgroundFadeIn 0.5s ease-out;
        }

        @keyframes backgroundFadeIn {
          0% {
            opacity: 0;
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
          }
        }

        /* Floating Baby Elements */
        .floating-element {
          position: absolute;
          font-size: 2rem;
          opacity: 0.1;
          animation: gentleFloat 6s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }

        .floating-element.balloon-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-element.balloon-2 {
          top: 20%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-element.star-1 {
          top: 30%;
          left: 20%;
          animation-delay: 1s;
        }

        .floating-element.star-2 {
          top: 40%;
          right: 20%;
          animation-delay: 3s;
        }

        .floating-element.cloud-1 {
          top: 15%;
          left: 5%;
          animation-delay: 0.5s;
        }

        .floating-element.cloud-2 {
          top: 35%;
          right: 5%;
          animation-delay: 2.5s;
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translateY(-20px) rotate(-1deg);
          }
          75% {
            transform: translateY(-10px) rotate(1deg);
          }
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-serif);
          font-weight: bold;
          line-height: 1.3;
        }

        h1 {
          font-size: 4rem;
          color: var(--primary);
          text-shadow: 2px 2px 4px rgba(255, 105, 180, 0.2);
        }

        h2 {
          font-size: 2.5rem;
          color: var(--foreground);
        }

        h3 {
          font-size: 1.8rem;
          color: var(--primary);
        }

        p {
          line-height: 1.6;
          color: var(--muted-foreground);
        }

        /* ==================== */
        /* 404 CONTAINER       */
        /* ==================== */
        .not-found-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--spacing-xl) var(--spacing-md);
          position: relative;
          z-index: 2;
        }

        .error-illustration {
          display: none;
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Glassmorphism Card */
        .error-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: var(--spacing-2xl);
          box-shadow: 0 20px 60px rgba(255, 182, 193, 0.3);
          text-align: center;
          max-width: 600px;
          width: 100%;
          animation: cardSlideUp 0.8s ease-out 0.3s both;
          position: relative;
        }

        @keyframes cardSlideUp {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-title {
          font-size: 3rem;
          color: white;
          margin-bottom: var(--spacing-md);
          font-family: var(--font-serif);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .error-subtitle {
          font-size: 1.5rem;
          color: white;
          margin-bottom: var(--spacing-lg);
          font-family: var(--font-sans);
          font-weight: 500;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .error-message {
          font-size: 1.1rem;
          color: white;
          margin-bottom: var(--spacing-xl);
          line-height: 1.6;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        /* Buttons */
        .error-actions {
          display: flex;
          gap: var(--spacing-lg);
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-block;
          padding: 1rem 2rem;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          font-family: var(--font-sans);
          text-decoration: none;
          min-width: 160px;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
          color: white;
          box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 105, 180, 0.5);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: var(--primary);
          border: 2px solid rgba(255, 182, 193, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .error-illustration {
            font-size: 6rem;
          }

          .error-title {
            font-size: 2.5rem;
          }

          .error-subtitle {
            font-size: 1.3rem;
          }

          .error-card {
            padding: var(--spacing-xl);
            margin: var(--spacing-lg);
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 280px;
          }

          .floating-element {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .error-illustration {
            font-size: 4rem;
          }

          .error-title {
            font-size: 2rem;
          }

          .error-card {
            padding: var(--spacing-lg);
          }

          .floating-element {
            font-size: 1.2rem;
          }
        }
      `}</style>

      {/* Floating Elements */}
      <div className="floating-element balloon-1">🎈</div>
      <div className="floating-element balloon-2">🎈</div>
      <div className="floating-element star-1">⭐</div>
      <div className="floating-element star-2">✨</div>
      <div className="floating-element cloud-1">☁️</div>
      <div className="floating-element cloud-2">☁️</div>

      <div className="not-found-container">
        <div className="error-illustration">👶</div>

        <div className="">
          <h1 className="error-title">404 — Page Not Found</h1>
          <p className="error-subtitle">Oops! Looks like this page is still taking baby steps.</p>
          <p className="error-message">
            The page you're looking for doesn't exist or may have been moved.<br />
            Let's guide you back to safety.
          </p>

          <div className="error-actions">
            <a href="/" className="btn btn-primary">
               Back to Home
            </a>
            <a href="/booking" className="btn btn-secondary">
              Go to Booking
            </a>
          </div>
        </div>
      </div>
    </>
  )
}