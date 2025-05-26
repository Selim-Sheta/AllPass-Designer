// S. Sheta 2025

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AllPassDesigner from './components/AllPassDesigner';
import './styles/Global.css'
import './styles/UnitCircle.css'
import './styles/Plotly.css'
import './styles/Tables.css'
import './styles/Interactables.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AllPassDesigner/>
    </StrictMode>,
)
