import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { CompareProvider } from './contexts/CompareContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <App />
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
