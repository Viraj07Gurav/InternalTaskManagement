import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SessionProvider } from './Context/SessionContext.jsx'; // Import the SessionProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionProvider> {/* Wrap App with SessionProvider */}
      <App />
    </SessionProvider>
  </StrictMode>
);
