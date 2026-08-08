import { useState } from 'react'
import { useRestaurant } from '../context/RestaurantContext'
import { CATEGORY_LABELS } from '../data/seed'
import { formatMoney } from '../lib/format'
import type { Category, MenuItem } from '../types'
import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'

type Tab = 'menu' | 'settings' | 'orders'

const emptyForm = {
  name: '',
  description: '',
  price: 12,
  category: 'mains' as Category,
  image:
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  available: true,
  popular: false,
  prepMinutes: 15,
}

export function AdminPage() {
  const {
    menu,
    orders,
    settings,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateSettings,
    updateOrderStatus,
    resetDemo,
  } = useRestaurant()
  const [tab, setTab] = useState<Tab>('menu')
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available,
      popular: !!item.popular,
      prepMinutes: item.prepMinutes,
    })
    setShowForm(true)
  }

  function saveItem(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      updateMenuItem(editing.id, form)
    } else {
      addMenuItem(form)
    }
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="page admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin panel</p>
          <h1>Restaurant control</h1>
          <p className="lede">Manage menu, settings, and order overrides.</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={resetDemo}>
          <RotateCcw size={16} />
          Reset demo data
        </button>
      </div>

      <div className="chip-row">
        {(
          [
            ['menu', 'Menu'],
            ['orders', 'Orders'],
            ['settings', 'Settings'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`chip ${tab === key ? 'is-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'menu' && (
        <section className="panel">
          <div className="panel__toolbar">
            <h2>Menu items ({menu.length})</h2>
            <button type="button" className="btn btn--sm" onClick={openCreate}>
              <Plus size={14} />
              Add item
            </button>
          </div>

          {showForm && (
            <form className="admin-form" onSubmit={saveItem}>
              <h3>{editing ? 'Edit item' : 'New item'}</h3>
              <div className="form-grid">
                <label>
                  Name
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    min={1}
                    step={0.5}
                    required
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: Number(e.target.value) }))
                    }
                  />
                </label>
                <label className="span-2">
                  Description
                  <input
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as Category,
                      }))
                    }
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Prep minutes
                  <input
                    type="number"
                    min={1}
                    value={form.prepMinutes}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        prepMinutes: Number(e.target.value),
                      }))
                    }
                  />
                </label>
                <label className="span-2">
                  Image URL
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, image: e.target.value }))
                    }
                  />
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, available: e.target.checked }))
                    }
                  />
                  Available
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, popular: e.target.checked }))
                    }
                  />
                  Popular
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn--sm">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-item">
                        <img src={item.image} alt="" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>{CATEGORY_LABELS[item.category]}</td>
                    <td>{formatMoney(item.price)}</td>
                    <td>
                      <button
                        type="button"
                        className={`badge ${item.available ? 'badge--ready' : 'badge--muted'}`}
                        onClick={() =>
                          updateMenuItem(item.id, {
                            available: !item.available,
                          })
                        }
                      >
                        {item.available ? 'Available' : 'Hidden'}
                      </button>
                    </td>
                    <td className="admin-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Edit"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Delete"
                        onClick={() => {
                          if (confirm(`Delete ${item.name}?`)) {
                            deleteMenuItem(item.id)
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'orders' && (
        <section className="panel">
          <h2>All orders</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Guest</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Override</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.code}</td>
                    <td>{o.customerName}</td>
                    <td>{formatMoney(o.total)}</td>
                    <td>
                      <span className={`badge badge--${o.status}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            o.id,
                            e.target.value as typeof o.status,
                          )
                        }
                      >
                        {[
                          'pending',
                          'confirmed',
                          'preparing',
                          'ready',
                          'completed',
                          'cancelled',
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'settings' && (
        <section className="panel">
          <h2>Restaurant settings</h2>
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault()
              const data = new FormData(e.currentTarget)
              updateSettings({
                name: String(data.get('name')),
                tagline: String(data.get('tagline')),
                address: String(data.get('address')),
                phone: String(data.get('phone')),
                openHours: String(data.get('openHours')),
                tables: Number(data.get('tables')),
                taxRate: Number(data.get('taxRate')) / 100,
              })
            }}
          >
            <div className="form-grid">
              <label>
                Name
                <input name="name" defaultValue={settings.name} required />
              </label>
              <label>
                Phone
                <input name="phone" defaultValue={settings.phone} />
              </label>
              <label className="span-2">
                Tagline
                <input name="tagline" defaultValue={settings.tagline} />
              </label>
              <label className="span-2">
                Address
                <input name="address" defaultValue={settings.address} />
              </label>
              <label className="span-2">
                Hours
                <input name="openHours" defaultValue={settings.openHours} />
              </label>
              <label>
                Tables
                <input
                  name="tables"
                  type="number"
                  min={1}
                  defaultValue={settings.tables}
                />
              </label>
              <label>
                Tax %
                <input
                  name="taxRate"
                  type="number"
                  min={0}
                  step={0.1}
                  defaultValue={settings.taxRate * 100}
                />
              </label>
            </div>
            <button type="submit" className="btn btn--sm">
              Save settings
            </button>
          </form>
        </section>
      )}
    </div>
  )
}
