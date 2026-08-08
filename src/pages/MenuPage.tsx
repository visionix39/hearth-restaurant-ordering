import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useRestaurant } from '../context/RestaurantContext'
import { MenuItemCard } from '../components/MenuItemCard'
import { CATEGORY_LABELS } from '../data/seed'
import type { Category } from '../types'
import { formatMoney } from '../lib/format'

const categories: Array<Category | 'all'> = [
  'all',
  'starters',
  'mains',
  'sides',
  'desserts',
  'drinks',
]

export function MenuPage() {
  const { menu, cartCount, cartSubtotal, tableNumber, setTableNumber } =
    useRestaurant()
  const [params] = useSearchParams()
  const [category, setCategory] = useState<Category | 'all'>('all')

  useEffect(() => {
    const t = params.get('table')
    if (t) {
      const n = Number(t)
      if (!Number.isNaN(n)) setTableNumber(n)
    }
  }, [params, setTableNumber])

  const filtered = useMemo(() => {
    return menu.filter((m) => category === 'all' || m.category === category)
  }, [menu, category])

  return (
    <div className="page menu-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">QR & online menu</p>
          <h1>Tonight&apos;s menu</h1>
          {tableNumber ? (
            <p className="lede">Table {tableNumber} · order when you&apos;re ready</p>
          ) : (
            <p className="lede">Wood-fired plates, seasonal sides, house drinks</p>
          )}
        </div>
        {cartCount > 0 && (
          <Link to="/checkout" className="btn">
            <ShoppingBag size={16} />
            Cart · {formatMoney(cartSubtotal)}
          </Link>
        )}
      </div>

      <div className="chip-row" role="tablist" aria-label="Categories">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            className={`chip ${category === c ? 'is-active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
