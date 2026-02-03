import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SidebarContext } from './context/SidebarContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SidebarContext>
      <GoogleOAuthProvider clientId="773585512502-tpu8hjfbera7v5tvehb6btp4alie4u5g.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </SidebarContext>
  </StrictMode>,
)
