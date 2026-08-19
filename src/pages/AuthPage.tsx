import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'signup'

export function AuthPage() {
  const { login, signup, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from || '/checkout'

  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to={from === '/auth' ? '/' : from} replace />
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result =
      mode === 'login'
        ? login(email, password)
        : signup({ name, email, password })

    if (!result.ok) {
      setError(result.error)
      return
    }

    navigate(from === '/auth' ? '/' : from, { replace: true })
  }

  return (
    <div className="page auth-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
          <p className="lede">
            Sign in as a guest to place orders, or use the admin demo account
            for Admin & Analytics.
          </p>
        </div>
      </div>

      <div className="auth-layout">
        <form className="panel auth-form" onSubmit={submit}>
          <div
            className="seg-control seg-control--2"
            role="group"
            aria-label="Auth mode"
          >
            <button
              type="button"
              className={mode === 'login' ? 'is-active' : ''}
              onClick={() => {
                setMode('login')
                setError('')
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'is-active' : ''}
              onClick={() => {
                setMode('signup')
                setError('')
              }}
            >
              Sign up
            </button>
          </div>

          {mode === 'signup' && (
            <label>
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn--block">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          {/* <p className="muted auth-form__hint">
            Guest demo: maya@example.com / guest123
            <br />
            Admin demo: admin@hearth.com / admin123
          </p> */}
        </form>

        <aside className="panel auth-aside">
          <h2>Why sign in?</h2>
          <ul className="auth-aside__list">
            <li>Place an order after adding items to your cart</li>
            <li>Leave a review for your meal</li>
            <li>Admins unlock Admin & Analytics</li>
          </ul>
          <Link to="/menu" className="btn btn--ghost">
            Browse menu first
          </Link>
        </aside>
      </div>
    </div>
  )
}
