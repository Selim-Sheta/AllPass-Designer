// S. Sheta 2025
import React from 'react';
import FilterDesigner from './components/FilterDesigner';

export default function App() {
    return (
        <div className="app-container flex flex-col gap-4 p-4">
            <div className="options-panel border p-2">
                <h2>Options (Coming Soon)</h2>
            </div>
            <FilterDesigner />
        </div>
    );
}