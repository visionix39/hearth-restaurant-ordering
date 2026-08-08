import { useMemo } from 'react'
import { useRestaurant } from '../context/RestaurantContext'
import { StatusBadge } from '../components/StatusBadge'
import { formatMoney, nextStatus, relativeMinutes } from '../lib/format'
import type { Order, OrderStatus } from '../types'

const COLUMNS: { key: OrderStatus; title: string }[] = [
  { key: 'pending', title: 'Incoming' },
  { key: 'confirmed', title: 'Confirmed' },
  { key: 'preparing', title: 'Preparing' },
  { key: 'ready', title: 'Ready' },
]

export function KitchenPage() {
  const { orders, updateOrderStatus } = useRestaurant()

  const active = useMemo(
    () =>
      orders.filter((o) =>
        ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status),
      ),
    [orders],
  )

  return (
    <div className="page kitchen-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Kitchen dashboard</p>
          <h1>Ticket board</h1>
          <p className="lede">
            {active.length} active ticket{active.length === 1 ? '' : 's'} · advance
            each order through the line
          </p>
        </div>
      </div>

      <div className="kitchen-board">
        {COLUMNS.map((col) => {
          const tickets = active.filter((o) => o.status === col.key)
          return (
            <section key={col.key} className="kitchen-col">
              <header>
                <h2>{col.title}</h2>
                <span>{tickets.length}</span>
              </header>
              <div className="kitchen-col__list">
                {tickets.length === 0 && (
                  <p className="muted kitchen-empty">No tickets</p>
                )}
                {tickets.map((order) => (
                  <TicketCard
                    key={order.id}
                    order={order}
                    onAdvance={() => {
                      const next = nextStatus(order.status)
                      if (next) updateOrderStatus(order.id, next)
                    }}
                    onCancel={() => updateOrderStatus(order.id, 'cancelled')}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function TicketCard({
  order,
  onAdvance,
  onCancel,
}: {
  order: Order
  onAdvance: () => void
  onCancel: () => void
}) {
  const next = nextStatus(order.status)
  return (
    <article className="ticket">
      <div className="ticket__head">
        <strong>{order.code}</strong>
        <StatusBadge status={order.status} />
      </div>
      <p className="ticket__meta">
        {order.customerName}
        {order.tableNumber ? ` · Table ${order.tableNumber}` : ` · ${order.type}`}
      </p>
      <p className="muted">{relativeMinutes(order.createdAt)}</p>
      <ul>
        {order.items.map((item) => (
          <li key={`${order.id}-${item.menuItemId}`}>
            <span className="ticket__qty">{item.quantity}</span>
            {item.name}
          </li>
        ))}
      </ul>
      <p className="ticket__total">{formatMoney(order.total)}</p>
      <div className="ticket__actions">
        {next && (
          <button type="button" className="btn btn--sm" onClick={onAdvance}>
            Mark {next}
          </button>
        )}
        {order.status === 'pending' && (
          <button type="button" className="btn btn--sm btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </article>
  )
}
