import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './buffer-polyfill';
import './index.css';

// Ensure Buffer is available globally
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);