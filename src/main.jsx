// S. Sheta 2025
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FilterDesigner from './components/FilterDesigner';
import './global.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <FilterDesigner />
    </StrictMode>,
)
