import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'
import { getSettings } from './services/progress'
import { applyTheme } from './services/theme'

// Before the first render, so a forced theme doesn't flash the wrong one.
applyTheme(getSettings().theme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
