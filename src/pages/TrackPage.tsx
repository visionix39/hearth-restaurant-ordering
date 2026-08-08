import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRestaurant } from '../context/RestaurantContext'
import { StatusBadge } from '../components/StatusBadge'
import {
  formatMoney,
  formatTime,
  STATUS_FLOW,
  STATUS_LABELS,
} from '../lib/format'
import type { OrderStatus } from '../types'

export function TrackPage() {
  const { code: routeCode } = useParams()
  const { getOrderByCode } = useRestaurant()
  const [query, setQuery] = useState(routeCode ?? '')
  const [lookup, setLookup] = useState(routeCode ?? '')

  useEffect(() => {
    if (routeCode) {
      setQuery(routeCode)
      setLookup(routeCode)
    }
  }, [routeCode])

  const order = lookup ? getOrderByCode(lookup) : undefined

  function search(e: React.FormEvent) {
    e.preventDefault()
    setLookup(query.trim())
  }

  return (
    <div className="page track-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Order tracking</p>
          <h1>Follow your order</h1>
          <p className="lede">Enter an order code like HR-1042 to see live status.</p>
        </div>
      </div>

      <form className="track-form panel" onSubmit={search}>
        <label>
          Order code
          <div className="track-form__row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="HR-1042"
            />
            <button type="submit" className="btn">
              Track
            </button>
          </div>
        </label>
      </form>

      {lookup && !order && (
        <div className="panel empty-inline">
          <p>No order found for <strong>{lookup}</strong>.</p>
          <p className="muted">Try a seeded code: HR-1042, HR-1043, or HR-1041.</p>
        </div>
      )}

      {order && (
        <section className="panel track-result">
          <div className="track-result__head">
            <div>
              <p className="eyebrow">{order.code}</p>
              <h2>{order.customerName}</h2>
              <p className="muted">
                {order.type === 'dine-in'
                  ? `Table ${order.tableNumber}`
                  : order.type}{' '}
                · placed {formatTime(order.createdAt)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <ol className="timeline">
            {STATUS_FLOW.map((step) => {
              const activeIndex = STATUS_FLOW.indexOf(
                order.status === 'cancelled' ? 'pending' : order.status,
              )
              const stepIndex = STATUS_FLOW.indexOf(step)
              const done =
                order.status !== 'cancelled' && stepIndex <= activeIndex
              const current =
                order.status !== 'cancelled' && stepIndex === activeIndex
              return (
                <li
                  key={step}
                  className={`timeline__step ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}
                >
                  <span className="timeline__dot" />
                  <span>{STATUS_LABELS[step as OrderStatus]}</span>
                </li>
              )
            })}
          </ol>

          {order.status === 'cancelled' && (
            <p className="form-error">This order was cancelled.</p>
          )}

          <ul className="simple-list">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.menuItemId}`}>
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span>{formatMoney(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="totals">
            <div className="totals__grand">
              <span>Total</span>
              <span>{formatMoney(order.total)}</span>
            </div>
            <p className="muted">
              Estimated prep ~{order.estimatedMinutes} minutes
            </p>
          </div>

          <Link to="/menu" className="btn btn--ghost">
            Order again
          </Link>
        </section>
      )}
    </div>
  )
}
