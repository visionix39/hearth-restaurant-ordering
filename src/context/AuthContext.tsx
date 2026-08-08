import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { seedUsers } from '../data/seed'
import type { User, UserRole } from '../types'

const AUTH_STORAGE_KEY = 'hearth-auth-v1'

interface AuthPersisted {
  users: User[]
  currentUserId: string | null
}

interface AuthContextValue {
  user: User | null
  users: User[]
  isAdmin: boolean
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  signup: (input: {
    name: string
    email: string
    password: string
  }) => { ok: true } | { ok: false; error: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadAuth(): AuthPersisted {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AuthPersisted
      const seededIds = new Set(seedUsers.map((u) => u.id))
      const custom = parsed.users.filter((u) => !seededIds.has(u.id))
      return {
        users: [...seedUsers, ...custom],
        currentUserId: parsed.currentUserId,
      }
    }
  } catch {
    /* ignore */
  }
  return { users: seedUsers, currentUserId: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => loadAuth(), [])
  const [users, setUsers] = useState<User[]>(initial.users)
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    initial.currentUserId,
  )

  useEffect(() => {
    const payload: AuthPersisted = { users, currentUserId }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
  }, [users, currentUserId])

  const user = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? null,
    [users, currentUserId],
  )

  const isAdmin = user?.role === 'admin'

  const login = useCallback(
    (email: string, password: string) => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (!found || found.password !== password) {
        return { ok: false as const, error: 'Invalid email or password.' }
      }
      setCurrentUserId(found.id)
      return { ok: true as const }
    },
    [users],
  )

  const signup = useCallback(
    (input: { name: string; email: string; password: string }) => {
      const email = input.email.trim().toLowerCase()
      if (!input.name.trim()) {
        return { ok: false as const, error: 'Please enter your name.' }
      }
      if (!email || !email.includes('@')) {
        return { ok: false as const, error: 'Please enter a valid email.' }
      }
      if (input.password.length < 4) {
        return {
          ok: false as const,
          error: 'Password must be at least 4 characters.',
        }
      }
      if (users.some((u) => u.email.toLowerCase() === email)) {
        return {
          ok: false as const,
          error: 'An account with this email already exists.',
        }
      }

      const role: UserRole = 'guest'
      const next: User = {
        id: `u-${crypto.randomUUID().slice(0, 8)}`,
        name: input.name.trim(),
        email,
        password: input.password,
        role,
      }
      setUsers((prev) => [...prev, next])
      setCurrentUserId(next.id)
      return { ok: true as const }
    },
    [users],
  )

  const logout = useCallback(() => {
    setCurrentUserId(null)
  }, [])

  const value: AuthContextValue = {
    user,
    users,
    isAdmin,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
