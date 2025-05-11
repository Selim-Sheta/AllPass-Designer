import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return <h1>Hello from React!</h1>;
}

createRoot(document.getElementById('root')).render(<App />);
