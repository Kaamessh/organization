import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log("🏁 AURA: App Mounting Started...");
const root = createRoot(document.getElementById('root'));
root.render(<App />);
console.log("✅ AURA: App Render Triggered");
