// S. Sheta 2025
// Editable table component for pole data

import React from 'react';

export default function PoleTable({ poles, onEdit, onDelete }) {
    return (
        <div className="pole-list">
            <h3>Poles</h3>
            <div className="pole-table-scrollable">
                {poles.map((p) => (
                    <div key={p.id} className="pole-row">
                        <span>ID: {p.id}</span>
                        <span>
                            Real:
                            <input
                                type="number"
                                step="0.01"
                                value={p.pos.x}
                                onChange={(e) =>
                                    onEdit(p.id, { x: parseFloat(e.target.value), y: p.pos.y })
                                }
                            />
                        </span>
                        <span>
                            Imag:
                            <input
                                type="number"
                                step="0.01"
                                value={-p.pos.y}
                                onChange={(e) =>
                                    onEdit(p.id, { x: p.pos.x, y: -parseFloat(e.target.value) })
                                }
                            />
                        </span>
                        <button onClick={() => onDelete(p.id)}>X</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
