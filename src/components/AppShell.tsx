import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  QrCode,
  ChartColumn,
  ShoppingBag,
  MapPin,
  Menu,
  X,
  LogIn,
  LogOut,
  MessageSquareQuote,
  UserRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRestaurant } from '../context/RestaurantContext'
import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/qr', label: 'QR Menu', icon: QrCode },
  { to: '/track', label: 'Track', icon: MapPin },
  { to: '/reviews', label: 'Reviews', icon: MessageSquareQuote },
  { to: '/kitchen', label: 'Kitchen', icon: ChefHat },
]

const adminLinks = [
  { to: '/admin', label: 'Admin', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: ChartColumn },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { settings, cartCount } = useRestaurant()
  const { user, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const links = useMemo(
    () => (isAdmin ? [...publicLinks, ...adminLinks] : publicLinks),
    [isAdmin],
  )

  return (
    <div className={`shell ${isHome ? 'shell--home' : ''}`}>
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand__mark" aria-hidden />
            <span className="brand__name">{settings.name}</span>
          </Link>

          <nav className="topbar__nav" aria-label="Primary">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `topbar__link ${isActive ? 'is-active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar__actions">
            {user ? (
              <div className="user-chip" title={user.email}>
                <UserRound size={16} />
                <span className="user-chip__name">{user.name.split(' ')[0]}</span>
                {isAdmin && <span className="user-chip__role">Admin</span>}
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Sign out"
                  onClick={() => logout()}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="topbar__auth" onClick={() => setOpen(false)}>
                <LogIn size={16} />
                <span>Sign in</span>
              </Link>
            )}
            <Link to="/checkout" className="cart-btn" aria-label="Open cart">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="cart-btn__count">{cartCount}</span>
              )}
            </Link>
            <button
              type="button"
              className="icon-btn topbar__menu-btn"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mobile-nav">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `mobile-nav__link ${isActive ? 'is-active' : ''}`
                }
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            <Link
              to="/checkout"
              className="mobile-nav__link"
              onClick={() => setOpen(false)}
            >
              <ShoppingBag size={18} />
              Cart ({cartCount})
            </Link>
            {user ? (
              <button
                type="button"
                className="mobile-nav__link mobile-nav__button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
              >
                <LogOut size={18} />
                Sign out ({user.name.split(' ')[0]})
              </button>
            ) : (
              <Link
                to="/auth"
                className="mobile-nav__link"
                onClick={() => setOpen(false)}
              >
                <LogIn size={18} />
                Sign in
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="shell__main">{children}</main>

      {!isHome && (
        <footer className="site-footer">
          <p>
            {settings.name} · {settings.address}
          </p>
          <p className="muted">{settings.openHours}</p>
        </footer>
      )}
    </div>
  )
}
