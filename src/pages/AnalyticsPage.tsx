import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useRestaurant } from '../context/RestaurantContext'
import { dayKey, formatDate, formatMoney } from '../lib/format'

export function AnalyticsPage() {
  const { orders, menu } = useRestaurant()

  const completed = useMemo(
    () => orders.filter((o) => o.status === 'completed' || o.status === 'ready' || o.status === 'preparing' || o.status === 'confirmed' || o.status === 'pending'),
    [orders],
  )

  const revenueOrders = useMemo(
    () => orders.filter((o) => o.status !== 'cancelled'),
    [orders],
  )

  const todayRevenue = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return revenueOrders
      .filter((o) => dayKey(o.createdAt) === today)
      .reduce((s, o) => s + o.total, 0)
  }, [revenueOrders])

  const avgTicket = useMemo(() => {
    if (!revenueOrders.length) return 0
    return (
      revenueOrders.reduce((s, o) => s + o.total, 0) / revenueOrders.length
    )
  }, [revenueOrders])

  const revenueByDay = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; orders: number }>()
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      map.set(key, { date: key, revenue: 0, orders: 0 })
    }
    for (const o of revenueOrders) {
      const key = dayKey(o.createdAt)
      const row = map.get(key)
      if (row) {
        row.revenue += o.total
        row.orders += 1
      }
    }
    return [...map.values()].map((r) => ({
      ...r,
      label: formatDate(r.date + 'T12:00:00'),
      revenue: Math.round(r.revenue * 100) / 100,
    }))
  }, [revenueOrders])

  const popularItems = useMemo(() => {
    const counts = new Map<string, { name: string; qty: number; revenue: number }>()
    for (const o of revenueOrders) {
      for (const item of o.items) {
        const prev = counts.get(item.menuItemId) ?? {
          name: item.name,
          qty: 0,
          revenue: 0,
        }
        prev.qty += item.quantity
        prev.revenue += item.price * item.quantity
        counts.set(item.menuItemId, prev)
      }
    }
    return [...counts.values()]
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 6)
  }, [revenueOrders])

  const byType = useMemo(() => {
    const types = ['dine-in', 'takeaway', 'delivery'] as const
    return types.map((type) => ({
      type: type === 'dine-in' ? 'Dine in' : type === 'takeaway' ? 'Takeaway' : 'Delivery',
      count: revenueOrders.filter((o) => o.type === type).length,
    }))
  }, [revenueOrders])

  const availableCount = menu.filter((m) => m.available).length

  return (
    <div className="page analytics-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Service snapshot</h1>
          <p className="lede">Live numbers from demo orders stored in your browser.</p>
        </div>
      </div>

      <div className="stat-grid">
        <article className="stat">
          <p>Today&apos;s revenue</p>
          <strong>{formatMoney(todayRevenue)}</strong>
        </article>
        <article className="stat">
          <p>Active / open orders</p>
          <strong>
            {
              completed.filter((o) =>
                ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status),
              ).length
            }
          </strong>
        </article>
        <article className="stat">
          <p>Avg ticket</p>
          <strong>{formatMoney(avgTicket)}</strong>
        </article>
        <article className="stat">
          <p>Menu live</p>
          <strong>
            {availableCount}/{menu.length}
          </strong>
        </article>
      </div>

      <div className="charts-grid">
        <section className="panel chart-panel">
          <h2>Revenue · last 7 days</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueByDay}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2c4a3e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2c4a3e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(20,32,28,0.08)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={40} />
                <Tooltip
                  formatter={(v) => formatMoney(Number(v ?? 0))}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(20,32,28,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2c4a3e"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel chart-panel">
          <h2>Orders by type</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byType}>
                <CartesianGrid stroke="rgba(20,32,28,0.08)" vertical={false} />
                <XAxis dataKey="type" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(20,32,28,0.1)',
                  }}
                />
                <Bar dataKey="count" fill="#c2703e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel">
        <h2>Top sellers</h2>
        <ul className="rank-list">
          {popularItems.map((item, i) => (
            <li key={item.name}>
              <span className="rank-list__n">{i + 1}</span>
              <div>
                <strong>{item.name}</strong>
                <p className="muted">{item.qty} sold</p>
              </div>
              <span>{formatMoney(item.revenue)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
