import { Plus, Minus } from 'lucide-react'
import type { MenuItem } from '../types'
import { formatMoney } from '../lib/format'
import { useRestaurant } from '../context/RestaurantContext'

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart, cart, updateCartQty } = useRestaurant()
  const inCart = cart.find((c) => c.menuItemId === item.id)

  return (
    <article className={`menu-card ${!item.available ? 'is-unavailable' : ''}`}>
      <div className="menu-card__media">
        <img src={item.image} alt="" loading="lazy" />
        {item.popular && <span className="menu-card__tag">Popular</span>}
      </div>
      <div className="menu-card__body">
        <div className="menu-card__top">
          <h3>{item.name}</h3>
          <span className="menu-card__price">{formatMoney(item.price)}</span>
        </div>
        <p>{item.description}</p>
        {item.available ? (
          inCart ? (
            <div className="qty-control">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => updateCartQty(item.id, inCart.quantity - 1)}
              >
                <Minus size={14} />
              </button>
              <span>{inCart.quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => updateCartQty(item.id, inCart.quantity + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => addToCart(item.id)}
            >
              Add
            </button>
          )
        ) : (
          <span className="badge badge--muted">Unavailable</span>
        )}
      </div>
    </article>
  )
}
