import { Link } from 'react-router-dom'
import {
  ArrowRight,
  QrCode,
  ChefHat,
  ChartColumn,
  MessageSquareQuote,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRestaurant } from '../context/RestaurantContext'

export function HomePage() {
  const { settings } = useRestaurant()
  const { isAdmin } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__backdrop" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80"
            alt=""
          />
          <div className="hero__veil" />
        </div>

        <div className="hero__content">
          <p className="hero__brand">{settings.name}</p>
          <h1>{settings.tagline}</h1>
          <p className="hero__lead">
            Scan, order, and follow every plate from kitchen to table — a full
            restaurant flow built for portfolio demos.
          </p>
          <div className="hero__cta">
            <Link to="/menu" className="btn btn--light">
              Order now
              <ArrowRight size={16} />
            </Link>
            <Link to="/qr" className="btn btn--ghost-light">
              <QrCode size={16} />
              Scan QR menu
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-head">
          <h2>One system, every station</h2>
          <p>Guest ordering, kitchen boards, reviews, and live analytics.</p>
        </div>
        <div className="feature-grid">
          <Link to="/menu" className="feature">
            <UtensilsIcon />
            <h3>Online ordering</h3>
            <p>Browse the full menu, build a cart, and checkout in seconds.</p>
          </Link>
          <Link to="/qr" className="feature">
            <QrCode size={22} />
            <h3>QR table menus</h3>
            <p>Generate table codes that open a mobile-ready menu instantly.</p>
          </Link>
          <Link to="/kitchen" className="feature">
            <ChefHat size={22} />
            <h3>Kitchen dashboard</h3>
            <p>Advance tickets from pending to ready with a clear board view.</p>
          </Link>
          <Link to="/reviews" className="feature">
            <MessageSquareQuote size={22} />
            <h3>Guest reviews</h3>
            <p>Read what diners loved and share your own tasting notes.</p>
          </Link>
          {isAdmin && (
            <Link to="/analytics" className="feature">
              <ChartColumn size={22} />
              <h3>Analytics</h3>
              <p>Revenue, popular dishes, and order volume at a glance.</p>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

function UtensilsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
