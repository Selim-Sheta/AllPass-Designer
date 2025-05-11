import React from 'react';
import { createRoot } from 'react-dom/client';
import InteractivePlot from './Components/InteractivePlot';
import './styles.css';

function App() {
  return <InteractivePlot />;
}

createRoot(document.getElementById('root')).render(<App />);
