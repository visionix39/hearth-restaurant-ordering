import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRestaurant } from '../context/RestaurantContext'
import { formatMoney } from '../lib/format'
import type { OrderType } from '../types'

export function CheckoutPage() {
  const {
    cart,
    menu,
    settings,
    tableNumber,
    updateCartQty,
    removeFromCart,
    placeOrder,
    cartSubtotal,
  } = useRestaurant()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = useState<OrderType>(
    tableNumber ? 'dine-in' : 'takeaway',
  )
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState('')
  const [table, setTable] = useState(tableNumber?.toString() ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.name && !name) setName(user.name)
  }, [user, name])

  const tax = Math.round(cartSubtotal * settings.taxRate * 100) / 100
  const total = Math.round((cartSubtotal + tax) * 100) / 100

  const lines = useMemo(() => {
    return cart
      .map((c) => {
        const item = menu.find((m) => m.id === c.menuItemId)
        if (!item) return null
        return { ...c, item }
      })
      .filter(Boolean) as Array<{
      menuItemId: string
      quantity: number
      item: (typeof menu)[number]
    }>
  }, [cart, menu])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setError('Please sign in to place your order.')
      return
    }
    if (!lines.length) {
      setError('Your cart is empty.')
      return
    }
    if (!name.trim()) {
      setError('Please add a name for the order.')
      return
    }
    if (type === 'dine-in' && !table) {
      setError('Choose a table number for dine-in.')
      return
    }

    const order = placeOrder({
      type,
      customerName: name.trim(),
      phone: phone.trim() || undefined,
      tableNumber: type === 'dine-in' ? Number(table) : undefined,
    })
    navigate(`/track/${order.code}`)
  }

  if (!lines.length) {
    return (
      <div className="page empty-state">
        <h1>Your cart is empty</h1>
        <p className="lede">Add something delicious from the menu.</p>
        <Link to="/menu" className="btn">
          Browse menu
        </Link>
      </div>
    )
  }

  return (
    <div className="page checkout-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Review & place order</h1>
        </div>
      </div>

      {!user && (
        <div className="auth-banner">
          <div>
            <strong>Sign in to place your order</strong>
            <p className="muted">
              You can keep browsing your cart — a guest account is enough to
              checkout.
            </p>
          </div>
          <Link to="/auth" state={{ from: '/checkout' }} className="btn">
            Sign in / Sign up
          </Link>
        </div>
      )}

      <div className="checkout-grid">
        <section className="panel">
          <h2>Items</h2>
          <ul className="cart-list">
            {lines.map(({ menuItemId, quantity, item }) => (
              <li key={menuItemId} className="cart-line">
                <img src={item.image} alt="" />
                <div className="cart-line__info">
                  <strong>{item.name}</strong>
                  <span>{formatMoney(item.price)}</span>
                </div>
                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() => updateCartQty(menuItemId, quantity - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateCartQty(menuItemId, quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeFromCart(menuItemId)}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <form className="panel checkout-form" onSubmit={submit}>
          <h2>Details</h2>

          <div className="seg-control" role="group" aria-label="Order type">
            {(['dine-in', 'takeaway', 'delivery'] as OrderType[]).map((t) => (
              <button
                key={t}
                type="button"
                className={type === t ? 'is-active' : ''}
                onClick={() => setType(t)}
              >
                {t === 'dine-in'
                  ? 'Dine in'
                  : t === 'takeaway'
                    ? 'Takeaway'
                    : 'Delivery'}
              </button>
            ))}
          </div>

          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Who is this order for?"
              required
            />
          </label>

          {type !== 'dine-in' && (
            <label>
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
              />
            </label>
          )}

          {type === 'dine-in' && (
            <label>
              Table number
              <input
                type="number"
                min={1}
                max={settings.tables}
                value={table}
                onChange={(e) => setTable(e.target.value)}
                required
              />
            </label>
          )}

          <div className="totals">
            <div>
              <span>Subtotal</span>
              <span>{formatMoney(cartSubtotal)}</span>
            </div>
            <div>
              <span>Tax ({Math.round(settings.taxRate * 100)}%)</span>
              <span>{formatMoney(tax)}</span>
            </div>
            <div className="totals__grand">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          {user ? (
            <button type="submit" className="btn btn--block">
              Place order
            </button>
          ) : (
            <Link
              to="/auth"
              state={{ from: '/checkout' }}
              className="btn btn--block"
            >
              Sign in to place order
            </Link>
          )}
        </form>
      </div>
    </div>
  )
}
