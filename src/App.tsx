import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RestaurantProvider } from './context/RestaurantContext'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { QrPage } from './pages/QrPage'
import { TrackPage } from './pages/TrackPage'
import { KitchenPage } from './pages/KitchenPage'
import { AdminPage } from './pages/AdminPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AuthPage } from './pages/AuthPage'
import { ReviewsPage } from './pages/ReviewsPage'

export default function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/qr" element={<QrPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/track/:code" element={<TrackPage />} />
              <Route path="/kitchen" element={<KitchenPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute adminOnly>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </RestaurantProvider>
    </AuthProvider>
  )
}
