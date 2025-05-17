// S. Sheta 2025
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AllPassDesigner from './components/AllPassDesigner';
import './global.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AllPassDesigner/>
    </StrictMode>,
)
