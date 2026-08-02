import './index.css';

import 'leaflet/dist/leaflet.css';
import './index.css'; // Tailwind styles (make sure src/index.css exists)
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './i18n';

createRoot(document.getElementById('root')).render(<App />)
