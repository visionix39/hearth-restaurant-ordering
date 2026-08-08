import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useRestaurant } from '../context/RestaurantContext'
import { Link } from 'react-router-dom'

export function QrPage() {
  const { settings } = useRestaurant()
  const [table, setTable] = useState(7)

  const menuUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/menu?table=${table}`
  }, [table])

  return (
    <div className="page qr-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">QR menu</p>
          <h1>Table codes</h1>
          <p className="lede">
            Print these for each table — guests scan and land on a live menu.
          </p>
        </div>
      </div>

      <div className="qr-layout">
        <section className="qr-card panel">
          <div className="qr-card__frame">
            <QRCodeSVG value={menuUrl} size={220} level="M" includeMargin />
          </div>
          <p className="qr-card__brand">{settings.name}</p>
          <h2>Table {table}</h2>
          <p className="muted">Scan to open tonight&apos;s menu</p>
          <code className="qr-url">{menuUrl}</code>
          <Link to={`/menu?table=${table}`} className="btn btn--sm">
            Open linked menu
          </Link>
        </section>

        <section className="panel">
          <h2>Choose a table</h2>
          <p className="muted">
            Demo generators for all {settings.tables} tables.
          </p>
          <div className="table-grid">
            {Array.from({ length: settings.tables }, (_, i) => i + 1).map(
              (n) => (
                <button
                  key={n}
                  type="button"
                  className={`table-chip ${table === n ? 'is-active' : ''}`}
                  onClick={() => setTable(n)}
                >
                  {n}
                </button>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
